import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json()); // API aceita JSON

app.use(cors({
  origin: 'http://localhost:4200', // URL do angular
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}))

mongoose.connect(process.env.MONGODB_URI, { dbName: 'Aula' })
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar ao MongoDB', err));

const alunosSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true, minlength: 2 },
  idade: { type: Number, required: true, min: 0, max: 120 },
  curso: { type: String, required: true, trim: true },
  notas: { type: [Number], default: [], validate: v => v.every(n => n >= 0 && n <= 10) }
}, { collection: 'Alunos', timestamps: true });
const Aluno = mongoose.model('Aluno', alunosSchema, 'Alunos');

// Rotas inicial
app.get('/', async(req, res) => res.json({ msg: 'API rodando'}));

//Criar aluno
app.post('/alunos', async (req, res) => {
    const alunos = await Aluno.create(req.body);
    res.status(201).json(alunos);
});

// Listar alunos
app.get('/alunos', async (req, res) => {
    const alunos = await Aluno.find();
    res.json(alunos);
});

app.put('/alunos/:id', async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const aluno = await Aluno.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true, overwrite: true }
      );

      if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });
      res.json(aluno);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

app.delete('/alunos/:id', async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const aluno = await Aluno.findByIdAndDelete(req.params.id);

      if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });
      res.json({ ok: true });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

app.get('/alunos/:id', async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const aluno = await Aluno.findById(req.params.id);
      if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });
      res.json(aluno);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// Iniciar servidor
app.listen(process.env.PORT, () => 
    console.log(`Servidor rodando em http://localhost:${process.env.PORT}`)
);