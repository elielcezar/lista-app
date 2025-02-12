import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';

const prisma = new PrismaClient();
const router = express.Router();

// Configuração do multer para armazenar arquivos localmente
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Criar Tarefa
router.post('/tarefas', upload.array('fotos'), async (req, res) => {
    console.log('Recebendo requisição POST /tarefas');
    
    const { 
        titulo,        
        descricao,
        usuarios  // Vamos usar isso como userId
    } = req.body;

    try {
        console.log('Dados recebidos:', {titulo, descricao, usuarios});   
        
        const createData = {
            titulo,                
            descricao,  
            imagemAntes: '',  // Valor padrão vazio
            imagemDepois: '', // Valor padrão vazio
            user: {
                connect: {
                    id: parseInt(usuarios)  // Conecta ao usuário existente
                }
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const response = await prisma.tarefa.create({
            data: createData,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        
        console.log('Tarefa criada:', response);
        res.status(201).json(response);
    } catch (error) {
        console.error('Erro ao criar Tarefa:', error);
        res.status(500).json({ error: 'Erro ao criar Tarefa' });
    }
});

// Listar tarefas
router.get('/tarefas', async (req, res) => {

    try {
        console.log('Recebendo requisição GET /tarefas');        

        // Criar objeto de filtro apenas com parâmetros definidos
        const filtro = {};

        if (req.query.id) filtro.id = req.query.id;  

        if (req.query.userId || req.query.userName) {
            filtro.userId = {
                some: {
                    user: {
                        AND: [                            
                            req.query.userId ? { 
                                id: req.query.userId 
                            } : {},                            
                            req.query.userName ? { 
                                name: { contains: req.query.userName, mode: 'insensitive' } 
                            } : {}
                        ]
                    }
                }
            };
        }               

        const tarefas = await prisma.tarefa.findMany({
            where: filtro,
            select: {
                id: true,
                titulo: true,
                descricao: true,
                imagemAntes: true,
                imagemDepois: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }       
        });

        console.log('Tarefas encontradas:', tarefas);
        res.status(200).json(tarefas);
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }

});

// Obter tarefa pelo ID
router.get('/tarefas/id/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const tarefa = await prisma.tarefa.findUnique({
            where: { 
                id: parseInt(id)
            },
            select: {
                id: true,
                titulo: true,
                descricao: true,
                imagemAntes: true,
                imagemDepois: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }  
        });

        if (!tarefa) {
            return res.status(404).json({
                error: 'Tarefa não encontrada'
            });
        }
        res.json(tarefa);
    } catch (error) {
        console.error('Erro ao buscar Tarefa:', error);
        res.status(500).json({
            error: 'Erro ao buscar Tarefa'
        });
    }
});


// Atualizar tarefa
router.put('/tarefas/:id', upload.array('fotos'), async (req, res) => {    
    try {
        console.log('Recebendo requisição /PUT');    

        const { id } = req.params;
        const {
            titulo,            
            descricao,
            usuarios  // será usado como userId
        } = req.body;        

        // Prepare update data
        const updateData = {
            titulo,
            descricao,
            updatedAt: new Date()
        };

        // Atualiza o usuário responsável se fornecido
        if (usuarios) {
            updateData.user = {
                connect: { 
                    id: parseInt(usuarios) 
                }
            };            
        }

        const updatedTarefa = await prisma.tarefa.update({
            where: { 
                id: parseInt(id) 
            },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        
        console.log('Tarefa atualizada:', updatedTarefa);
        res.status(200).json(updatedTarefa);
        
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
});

// Atualizar status da tarefa
router.patch('/tarefas/:id/status', async (req, res) => {  
    try {
        const { id } = req.params;
        const { status } = req.body;        

        const statusBoolean = Boolean(status);        

        const updated = await prisma.tarefa.update({
            where: { 
                id: parseInt(id)
            },
            data: { 
                status: statusBoolean,
                updatedAt: new Date()
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return res.json(updated);
    } catch (error) {
        console.error('Erro:', error);
        return res.status(500).json({ error: error.message });
    }
});

export default router;