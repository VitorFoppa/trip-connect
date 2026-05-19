## TripConnect

Aplicação full stack para planejamento e gerenciamento de viagens em grupo.

O projeto permite criar viagens, convidar participantes, gerenciar roteiros, controlar aplicações para participar de viagens e compartilhar avaliações.


## Tecnologias Utilizadas

Frontend
Next.js
React
TypeScript
Tailwind CSS
OpenRouteService API
Backend
FastAPI
Python
SQLAlchemy
JWT Authentication
Pydantic
Banco de Dados
PostgreSQL


## Funcionalidades

# Usuários

Cadastro e login com autenticação JWT
Upload de foto de perfil
Sistema de permissões
Perfil de usuário

# Viagens

Criar viagens públicas e privadas
Editar viagens
Excluir viagens
Participar de viagens
Sistema de convites
Sistema de aplicações para viagens

# Roteiros

Página de itinerário integrada
Traçado de rotas
Organização de destinos
Visualização de pontos da viagem

# Avaliações
Avaliação de viagens
Comentários
Sistema de reviews

# Estrutura do Projeto
tripconnect/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── database.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   └── styles/
│   └── package.json
│
└── README.md

# Como Rodar o Projeto
Clone o repositório
git clone <SEU_REPOSITORIO>
cd tripconnect
Backend
Entrar na pasta
cd backend
Criar ambiente virtual
Linux / Mac
python -m venv venv
source venv/bin/activate
Windows
python -m venv venv
venv\Scripts\activate
Instalar dependências
pip install -r requirements.txt
Rodar servidor
uvicorn app.main:app --reload

Backend disponível em:

http://localhost:8000

Frontend
Entrar na pasta
cd frontend
Instalar dependências
npm install
Rodar projeto
npm run dev

Frontend disponível em:

http://localhost:3000

# Variáveis de Ambiente
Backend .env
DATABASE_URL=postgresql://user:password@localhost/tripconnect
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
Frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ORS_API_KEY=YOUR_KEY

# APIs Utilizadas
OpenRouteService API

# Funcionalidades Futuras
Chat em tempo real
Notificações
Upload de imagens para viagens
Sistema de favoritos
Dashboard administrativo
Deploy em produção

# Aprendizados

Este projeto foi desenvolvido como projeto de portfólio para praticar:

Arquitetura Full Stack
APIs REST
Autenticação JWT
Integração com mapas
Relacionamentos no banco de dados
Organização de rotas e componentes
Controle de permissões
Desenvolvimento com Next.js e FastAPI

# Contribuição

Contribuições são bem-vindas.

Faça um fork
Crie uma branch
Commit suas alterações
Abra um Pull Request

# Licença

Este projeto está sob a licença MIT.

# Autor

Desenvolvido por Vitor Foppa.