// Passo 1: Instalar Dependências
// npm install express nodemailer axios body-parser node-cron

const express = require('express');
const nodemailer = require('nodemailer');
const axios = require('axios');
const bodyParser = require('body-parser');
const cron = require('node-cron');

const app = express();
app.use(bodyParser.json());

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'seu-email@gmail.com',
    pass: 'sua-senha'
  }
});

// Função para enviar email de cobrança
const sendBillingEmail = (email, cnpj) => {
  const mailOptions = {
    from: 'seu-email@gmail.com',
    to: email,
    subject: 'Cobrança',
    text: `Olá, estamos enviando uma cobrança para o CNPJ: ${cnpj}.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Email enviado: ' + info.response);
  });
};

// Rota para capturar CNPJ e email
app.post('/send-billing', async (req, res) => {
  const { cnpj, email } = req.body;

  if (!cnpj || !email) {
    return res.status(400).send('CNPJ e Email são obrigatórios');
  }

  // Enviar email de cobrança
  sendBillingEmail(email, cnpj);

  // Chamar API de cobrança (exemplo fictício)
  try {
    const response = await axios.post('https://api.exemplo.com/cobrar', { cnpj });
    res.status(200).send('Cobrança enviada com sucesso');
  } catch (error) {
    res.status(500).send('Erro ao enviar cobrança');
  }
});

// Agendar tarefa diária para enviar emails
cron.schedule('0 0 * * *', () => {
  // Aqui você pode definir a lógica para buscar os emails e CNPJs que precisam ser cobrados
  const emailsECnpjs = [
    { email: 'cliente1@example.com', cnpj: '12345678000100' },
    { email: 'cliente2@example.com', cnpj: '98765432000100' }
  ];

  emailsECnpjs.forEach(({ email, cnpj }) => {
    sendBillingEmail(email, cnpj);
  });

  console.log('Emails de cobrança enviados diariamente');
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});