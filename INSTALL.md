## 📘 `INSTALL.md`

````markdown
# Eagle‑Vision – Instalação e Configuração

## 🔧 Pré‑requisitos

- Ubuntu 20.04+ ou similar  
- Python 3.8+  
- Git, python3-venv, python3-pip  
- gunicorn, nginx  
- Usuário para deploy: `www-data`

## 1. Clonar o código

```bash
sudo mkdir -p /opt/eagle-vision
cd /opt/eagle-vision
sudo git clone git@github.com:grupo-aguia-ifrs/eagle-vision.git .
````

## 2. Ambiente virtual

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 3. Banco de dados e arquivos estáticos

```bash
python manage.py migrate
python manage.py collectstatic --noinput
sudo mkdir -p /opt/eagle-vision/static
```

## 4. Permissões

```bash
sudo chown -R www-data:www-data /opt/eagle-vision
sudo chmod -R 755 /opt/eagle-vision
```

## 5. Serviço Gunicorn (systemd)

**Arquivo**: `/etc/systemd/system/eagle-vision.service`

```ini
[Unit]
Description=Gunicorn daemon for Eagle Vision
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/opt/eagle-vision/backend
ExecStart=/opt/eagle-vision/backend/venv/bin/gunicorn eagle_vision.wsgi:application \
  --access-logfile - --workers 3 \
  --bind unix:/run/eagle-vision/eaglevision.sock

[Install]
WantedBy=multi-user.target
```

**Comandos**:

```bash
sudo systemctl daemon-reload
sudo systemctl enable eagle-vision
sudo systemctl start eagle-vision
```

## 6. Configuração do Nginx

**Arquivo**: `/etc/nginx/sites-available/eagle-vision`

```nginx
server {
  listen 80;
  server_name seu-dominio.com;

  location = /favicon.ico { access_log off; log_not_found off; }
  location /static/ {
    root /opt/eagle-vision;
  }

  location / {
    include proxy_params;
    proxy_pass http://unix:/run/eagle-vision/eaglevision.sock;
  }
}
```

Ative e teste:

```bash
sudo ln -s /etc/nginx/sites-available/eagle-vision /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 7. Verificação

* Acesse `http://seu-dominio.com` — aplicação deve estar funcionando
* Verifique logs e status:

```bash
sudo systemctl status eagle-vision
sudo journalctl -u eagle-vision
```

---
