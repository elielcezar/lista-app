import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from '../prisma/index.js'; 

const router = express.Router();

// Configurar o multer para o upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = './uploads';
        // Criar diretório se não existir
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Gerar nome único para o arquivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Apenas imagens são permitidas!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // limite de 5MB
    }
});

// Criar tarefa com upload de imagens
router.post('/tarefas', upload.fields([
    { name: 'imagemAntes', maxCount: 1 },
    { name: 'imagemDepois', maxCount: 1 }
]), async (req, res) => {
    try {
        console.log('Arquivos recebidos:', req.files);
        if (req.files?.imagemAntes) {
            console.log('Imagem Antes:', {
                tamanho: req.files.imagemAntes[0].size,
                tipo: req.files.imagemAntes[0].mimetype,
                nome: req.files.imagemAntes[0].originalname
            });
        }

        const { titulo, descricao, userId, authorId, observacoes } = req.body;       

        // Preparar objeto de criação
        const createData = {
            titulo,
            descricao,
            observacoes,
            userId: parseInt(userId),
            authorId: parseInt(authorId),
            createdAt: new Date()
        };

        // Adicionar imagens apenas se foram enviadas
        if (req.files?.imagemAntes) {
            createData.imagemAntes = req.files.imagemAntes[0].filename;
        }
        if (req.files?.imagemDepois) {
            createData.imagemDepois = req.files.imagemDepois[0].filename;
        }

        const tarefa = await prisma.tarefa.create({
            data: createData
        });

        res.status(201).json(tarefa);
    } catch (error) {
        console.error('Erro detalhado ao criar tarefa:', error);
        res.status(500).json({ 
            error: 'Erro ao criar tarefa',
            details: error.message 
        });
    }
});

// Rota para servir as imagens
router.get('/uploads/:filename', (req, res) => {
    const { filename } = req.params;
    res.sendFile(path.resolve(`./uploads/${filename}`));
});

// Listar tarefas
router.get('/tarefas', async (req, res) => {
    try {
        console.log('Recebendo requisição GET /tarefas');        

        // Pegar authorId, userId e status dos query params
        const { authorId, userId, status } = req.query;

        const where = {
            AND: []
        };

        // Adiciona filtros apenas se foram informados
        if (authorId) {
            where.AND.push({ authorId: parseInt(authorId) });
        }

        if (userId) {
            where.AND.push({ userId: parseInt(userId) });
        }

        // Adiciona filtro de status apenas se foi informado
        if (status !== undefined) {
            where.AND.push({ status: status === 'true' });
        }

        const tarefas = await prisma.tarefa.findMany({
            where,
            select: {
                id: true,
                titulo: true,
                descricao: true,
                imagemAntes: true,
                imagemDepois: true,
                status: true,
                observacoes: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        identifier: true
                    }
                },
                author: {
                    select: {
                        id: true,
                        name: true,
                        identifier: true
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
                observacoes: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        identifier: true
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
router.put('/tarefas/:id', upload.fields([
    { name: 'imagemAntes', maxCount: 1 },
    { name: 'imagemDepois', maxCount: 1 }
]), async (req, res) => {    
    try {
        const { id } = req.params;
        const { titulo, status, descricao, userId, manterImagemAntes, manterImagemDepois, observacoes } = req.body;

        // Preparar objeto de atualização
        const updateData = {
            titulo,
            status: status === 'true',
            descricao,
            observacoes,
            updatedAt: new Date()
        };

        // Adicionar userId se foi enviado
        if (userId) {
            updateData.userId = parseInt(userId);
        }

        // Limpar imagens se foram removidas
        if (manterImagemAntes === 'false') {
            updateData.imagemAntes = null;
        }
        if (manterImagemDepois === 'false') {
            updateData.imagemDepois = null;
        }

        // Adicionar novas imagens se foram enviadas
        if (req.files?.imagemAntes) {
            updateData.imagemAntes = req.files.imagemAntes[0].filename;
        }
        if (req.files?.imagemDepois) {
            updateData.imagemDepois = req.files.imagemDepois[0].filename;
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
                        identifier: true
                    }
                }
            }
        });
        
        res.status(200).json(updatedTarefa);
        
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        res.status(500).json({ 
            error: 'Erro ao atualizar tarefa',
            details: error.message 
        });
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
                        identifier: true
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

// Excluir tarefa
router.delete('/tarefas/:id', async (req, res) => {  
    try {
        const taskId = parseInt(req.params.id);  
       
        await prisma.tarefa.delete({
            where: {
                id: taskId
            }
        });

        res.status(200).json({
            message: 'Tarefa deletada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
        res.status(500).json({
            error: 'Erro ao deletar tarefa',
            details: error.message
        });
    }
});

export default router;