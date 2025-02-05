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

// Criar imovel
router.post('/imoveis', upload.array('fotos'), async (req, res) => {
    console.log('Recebendo requisição POST /imoveis');
    
    const { 
        titulo,        
        descricaoLonga,
        usuarios
    } = req.body;
    const fotos = req.files?.map(file => file.filename) || [];

    try {
        console.log('Dados recebidos:', {titulo, descricaoLonga, usuarios, fotos});   
        
        const createData = {
            titulo,                
            descricaoLonga,  
            fotos,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        if (usuarios && usuarios !== '') {
            createData.usuarios = {
                create: [{
                    user: {
                        connect: {
                            id: usuarios
                        }
                    }
                }]
            };
        }
        
        const response = await prisma.imovel.create({
            data: createData
        });
        console.log('Imóvel criado:', response);
        res.status(201).json(response);
    } catch (error) {
        console.error('Erro ao criar imóvel:', error);
        res.status(500).json({ error: 'Erro ao criar imóvel' });
    }
})

// Listar imoveis
router.get('/imoveis', async (req, res) => {

    try {
        console.log('Recebendo requisição GET /imoveis');        

        // Criar objeto de filtro apenas com parâmetros definidos
        const filtro = {};

        if (req.query.id) filtro.id = req.query.id;  

        if (req.query.userId || req.query.userName) {
            filtro.usuarios = {
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

        const imoveis = await prisma.imovel.findMany({
            where: filtro,
            select: {
                id: true,
                titulo: true,
                descricaoLonga: true,
                fotos: true,
                createdAt: true,
                updatedAt: true,
                usuarios: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }       
        });

        console.log('Imóveis encontrados:', imoveis);
        res.status(200).json(imoveis);
    } catch (error) {
        console.error('Erro ao buscar imóveis:', error);
        res.status(500).json({ error: 'Erro ao buscar imóveis' });
    }

});

// Obter imovel pelo ID
router.get('/imoveis/id/:id', async (req, res) => {
    try{
        const {id} = req.params;

        const imovel = await prisma.imovel.findUnique({
            where: {
                id: id
            }
        });
        if(!imovel){
            return res.status(404).json({
                error: 'Imóvel não encontrado'
            })
        }
        res.json(imovel);
    }catch(error){
        console.error('Erro ao buscar imóvel:', error);
        res.status(500).json({
            error: 'Erro ao buscar imóvel'
        });
    }
});


// Atualizar imovel
router.put('/imoveis/:id', upload.array('fotos'), async (req, res) => {    
    try{
        console.log('Recebendo requisição PUT /imoveis');    

        const { id } = req.params;
        const {
            titulo,            
            descricaoLonga,            
            oldPhotos
        } = req.body;

        console.log('req.body:', req.body);

        let fotos = [];
        if (oldPhotos) {
            fotos = JSON.parse(oldPhotos); // Converte string JSON para array
        }
        if (req.files && req.files.length > 0) {
            const novasFotos = req.files.map(file => file.filename);
            fotos = [...fotos, ...novasFotos]; // Mescla arrays
        }

        const data = {
            titulo,           
            descricaoLonga,           
            fotos
        };

        console.log('data:', data);

        const response = await prisma.imovel.update({
            where: { id },
            data: data            
        });        
        
        console.log('Imóvel atualizado:', response);
        res.status(200).json(response);
    }catch (error){
        console.error('Erro ao atualizar imóvel:', error);
        res.status(500).json({ error: 'Erro ao atualizar imóvel' });
    }
});

// Atualizar status da tarefa
router.patch('/imoveis/:id/status', async (req, res) => {   
    try {
        const { id } = req.params;
        
        const imovel = await prisma.imovel.findUnique({
            where: { id }
        });
        
        const updated = await prisma.imovel.update({
            where: { id },
            data: { status: !imovel.status }
        });

        return res.status(200).json(updated);
    } catch (error) {
        console.error('Erro:', error);
        return res.status(500).json({ error: 'Erro ao atualizar status' });
    }
});

export default router;


