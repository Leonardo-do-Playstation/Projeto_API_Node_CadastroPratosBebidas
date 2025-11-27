import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // API vai aceitar json

//Conectar no MongoDB
mongoose.connect(process.env.MONGODB_URI,{dbName:'Cardapio'})
.then(()=>console.log('Conectado ao MongoDB'))
.catch(err=>console.error('Erro na conexão:',err.message));

//Iniciar servidor
app.listen(process.env.PORT,()=>
  console.log(`Servidor rodando em http://localhost:${process.env.PORT}`)
);

//Modelo Prato
const pratoSchema = new mongoose.Schema({
  nome: {type: String, required: true, trim: true, minlength:2},
  preco: {type: Number, required: true},
  descricao: {type: String}
},{collection: 'pratos',timestamps:true});
const Prato = mongoose.model('Prato',pratoSchema);

//Modelo Refrigerante
const refriSchema = new mongoose.Schema({
  nome: {type: String, required: true, trim: true, minlength:2},
  preco: {type: Number, required: true},
  descricao: {type: String, required: true, trim: true}
},{collection: 'refrigerantes', timestamps: true});
const Refrigerante = mongoose.model('Refrigerante',refriSchema);

//Rota inicial
app.get('/',(req,res)=>res.json({msg:'API rodando'}));

//Criar Prato
app.post('/pratos',async(req,res)=>{
  const pratos = await Prato.create(req.body);
  res.status(201).json(pratos);
});

//Criar refrigerante
app.post('/refrigerantes',async(req,res)=>{
  const refrigerante = await Refrigerante.create(req.body);
  res.status(201).json(refrigerante);
});

//Listas pratos
app.get('/pratos',async(req,res)=>{
  const pratos = await Prato.find();
  res.json(pratos);
});

//Listar refrigerantes
app.get('/refrigerantes',async(req,res)=>{
  const refrigerantes = await Refrigerante.find();
  res.json(refrigerantes);
});

//Alterar prato
app.put('/pratos/:id',async(req, res)=>{
  try{
    if(!mongoose.isValidObjectId(req.params.id)){
      return res.status(400).json({error: 'ID Invalido'});
    }
    const prato = await Prato.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, overwrite: true}
    );
    if (!prato) return res.status(404).json({error: 'Prato nao encontrado'});
    res.json(prato);
  } catch(err){
    res.status(400).json({error:err.message});
  }
});

//Alterar refrigerante
app.put('/refrigerantes/:id',async(req, res)=>{
  try{
    if(!mongoose.isValidObjectId(req.params.id)){
      return res.status(400).json({error: 'ID Invalido'});
    }
    const refrigerante = await Refrigerante.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, overwrite: true}
    );
    if (!refrigerante) return res.status(404).json({error: 'Refrigerante nao encontrado'});
    res.json(refrigerante);
  } catch(err){
    res.status(400).json({error:err.message});
  }
});

//Excluir prato
app.delete('/pratos/:id',async(req,res)=>{
  try{
    if(!mongoose.isValidObjectId(req.params.id)){
      return res.status(400).json({error:'ID invalido'});
    }
    const prato = await Prato.findByIdAndDelete(req.params.id);
    if(!prato) return res.status(404).json({error: 'Prato não encontrado'});
    res.json({ok:true});
  } catch(err){
    res.status(500).json({error:err.message});
  }
});

//Excluir refrigerante
app.delete('/refrigerantes/:id',async(req,res)=>{
  try{
    if(!mongoose.isValidObjectId(req.params.id)){
      return res.status(400).json({error:'ID invalido'});
    }
    const refrigerante = await Refrigerante.findByIdAndDelete(req.params.id);
    if(!refrigerante) return res.status(404).json({error: 'Refrigerante não encontrado'});
    res.json({ok:true});
  } catch(err){
    res.status(500).json({error:err.message});
  }
});

//Consultar prato
app.get('/pratos/:id', async (req,res)=> {
  try{
    if(!mongoose.isValidObjectId(req.params.id)){
      return res.status(400).json({error:'ID invalido'});
    }
    const prato = await Prato.findById(req.params.id);
    if(!prato) return res.status(404).json({error:'Prato nao encontrado'});
    res.json(prato);
  } catch(err){
    res.status(500).json({error: err.message});
  }
});

//Consultar refrigerante
app.get('/refrigerantes/:id', async (req,res)=> {
  try{
    if(!mongoose.isValidObjectId(req.params.id)){
      return res.status(400).json({error:'ID invalido'});
    }
    const refrigerante = await Refrigerante.findById(req.params.id);
    if(!refrigerante) return res.status(404).json({error:'Refrigerante nao encontrado'});
    res.json(refrigerante);
  } catch(err){
    res.status(500).json({error: err.message});
  }
});