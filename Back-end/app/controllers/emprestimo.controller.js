const { sequelize } = require("../models");
const db = require("../models");
const Emprestimo = db.emprestimo;
const Associado = db.associado;
const Op = db.Sequelize.Op;

function addDias(data, dias){
  let resultado = new Date(data);
  resultado.setDate(resultado.getDate() + dias);

  return resultado;
}

exports.devolucao = async (req, res) => {
  let multa;

  if (!req.body.pub_isbn) {
    res.status(400).send({
      message: req.body
    });
    return;
  }

  await sequelize.query(
    "select * from emprestimo where pub_isbn = \'" + req.body.pub_isbn + "\'\
    and nro_exemplar = \'" + req.body.nro_exemplar + "\'"
  )
  .then(async data => {
      let today = new Date();
      let data_devol = new Date(data[0][0].data_devol)

      if (today <= data_devol){
        multa = 0;
      }
      else {
        let diferenca = today - data_devol
        multa = Math.floor(diferenca/(1000 * 3600 * 24))
      }

      await sequelize.query(
        "UPDATE reserva SET status = 'Avisado'\
         WHERE codigo_assoc = \'" + req.body.cod_assoc+ "\' and pub_isbn = \'" + req.body.pub_isbn + "\';\
         DELETE FROM emprestimo WHERE pub_isbn = \'" + req.body.pub_isbn + "\'\
         AND nro_exemplar = \'" + req.body.nro_exemplar + "\'"
      )
      .then(res.status(200).send({multa}))
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro"
        });
      });
    }
  )
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Erro"
    });
  });
}

exports.cadastrar_emprest = async (req, res) => {
  if (!req.body.cod_assoc) {
    res.status(400).send({
      message: req.body
    });
    return;
  }

  await sequelize.query(
    "SELECT COUNT(exemplar.numero) FROM exemplar LEFT JOIN emprestimo\
    ON (emprestimo.pub_isbn = exemplar.pub_isbn AND emprestimo.nro_exemplar = exemplar.numero)\
    WHERE (emprestimo.pub_isbn is null AND emprestimo.nro_exemplar is null\
    AND exemplar.pub_isbn = \'" + req.body.pub_isbn + "\')"
  )
  .then(async data => {
    let n_records = data[0][0].count;
    let flag;

    if(n_records > 0){
      await sequelize.query(
        "SELECT count(*) FROM reserva WHERE pub_isbn = \'" + req.body.pub_isbn + "\'"
      )
      .then(async data => {
        if(data[0][0].count > 0){
          await sequelize.query(
            "SELECT * FROM reserva\
            WHERE pub_isbn = \'" + req.body.pub_isbn + "\'\
            AND status = \'Iniciado\'\
            ORDER BY codigo ASC LIMIT \'" + n_records + "\'"
          )
          .then(data => {
            if(data[0].length > 0){
              if(data[0][0].codigo_assoc == req.body.cod_assoc){
                flag = true
              }
              else{
                res.status(200).send({flag:false, message: "Não é a vez do associado na fila de reserva", data})
              }
            }
            else{
              flag = true
            }
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Erro"
            });
          });
        }
        else{
          flag = true
        }
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro"
        });
      });
    }
    else{
      res.status(200).send({flag:false, message:"Nenhum exemplar disponível, é necessário realizar reserva."})
    }

    if(flag == true){
      await sequelize.query(
        "UPDATE reserva\
        SET status = 'Atendido'\
        WHERE codigo_assoc = \'" + req.body.cod_assoc + "\';"
      )
      
      await Associado.findAll({
        attributes: ['status'],
        where: {
          codigo: {
            [Op.eq]: req.body.cod_assoc
          }
        }
      })
      .then(async data => {
        let calc_data;
        let data_array = req.body.data_emp.split('-');

        let hold_data = new Date(data_array[0], data_array[1] - 1, data_array[2]) ;

        if(data[0].dataValues.status == 'Grad'){
          calc_data = addDias(hold_data, 7);
          calc_data = calc_data.toISOString().slice(0,10);
        }
        else if(data[0].dataValues.status == 'Posgrad'){
          calc_data = addDias(hold_data, 10);
          calc_data = calc_data.toISOString().slice(0,10);
        }
        else{
          calc_data = addDias(hold_data, 14);
          calc_data = calc_data.toISOString().slice(0,10);
        }

        await Emprestimo.create({
          nro_exemplar: req.body.nro_exemplar,
          pub_isbn: req.body.pub_isbn,
          cod_assoc: req.body.cod_assoc,
          data_emp: req.body.data_emp,
          data_devol: calc_data
        })
        .then(data => {
          res.status(200).send({flag:true, data})
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Erro"
          })
        })
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro"
        });
      });
    }
  })
}