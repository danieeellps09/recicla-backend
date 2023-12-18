# .env.example

# URL do banco de dados
DATABASE_URL="mysql://root:root@localhost:3306/nome_do_projeto"

# Credenciais do MySQL root
MYSQL_ROOT_USER="root"
MYSQL_ROOT_PASSWORD="root"

# Chave secreta para JWT
JWT_SECRET_KEY="sua_chave_secreta_jwt_aqui"

# Chave secreta para refresh token
REFRESH_TOKEN_SECRET="sua_chave_secreta_refresh_token_aqui"

# Configurações de e-mail
EMAIL_HOST='smtp.gmail.com'
EMAIL_USERNAME='seu_email@gmail.com'
EMAIL_PASSWORD='sua_senha_de_email_aqui'

# Tempo de expiração do JWT
JWT_EXPIRATION_TIME='1h'
