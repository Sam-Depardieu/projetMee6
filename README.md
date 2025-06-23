# 🚀 Mee8 Web Dashboard - Custom

Ce projet est un site web sécurisé permettant aux utilisateurs de se connecter avec Discord, visualiser leurs serveurs, et y ajouter un bot.

## 📦 Prérequis

- Un nom de domaine pointant vers ton serveur (ex : `bot.sa-it.fr`)
- Un serveur Ubuntu avec :
  - Node.js + npm
  - Nginx
  - Certbot (pour SSL)
  - PM2
- Un bot Discord créé sur : https://discord.com/developers/applications

---

## 🔧 Étapes d'installation

### 1. Cloner le projet

```bash
git clone <url_du_repo>
cd projetMee6
```

---

### 2. Configuration de l'environnement

Crée un fichier `.env` :

```ini
CLIENT_ID=TON_CLIENT_ID_DISCORD
CLIENT_SECRET=TON_SECRET_DISCORD
REDIRECT_URI=https://bot.sa-it.fr/callback
```

> ⚠️ L’URL de redirection **doit correspondre** à celle enregistrée dans le portail Discord.

---

### 3. Installer les dépendances

```bash
npm install
```

---

### 4. Lancer le serveur Node.js

Pour test :

```bash
node start.js
```

Pour lancer en arrière-plan avec PM2 :

```bash
pm2 start start.js --name mee8
```

---

### 5. Configurer Nginx

Crée ou modifie le fichier `/etc/nginx/sites-available/bot.sa-it.fr` :

```nginx
# HTTP (port 80) - redirection HTTPS + Certbot
server {
    listen 80;
    server_name bot.sa-it.fr www.bot.sa-it.fr;

    location /.well-known/acme-challenge/ {
        root /home/sam/projetMee6/website/public/;
        try_files $uri =404;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS (port 443)
server {
    listen 443 ssl http2;
    server_name bot.sa-it.fr www.bot.sa-it.fr;

    ssl_certificate /home/sam/projetMee6/certbot/conf/live/bot.sa-it.fr/fullchain.pem;
    ssl_certificate_key /home/sam/projetMee6/certbot/conf/live/bot.sa-it.fr/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Puis activer et recharger :

```bash
sudo ln -s /etc/nginx/sites-available/bot.sa-it.fr /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### 6. Générer le certificat SSL

```bash
sudo certbot certonly --webroot -w /home/sam/projetMee6/website/public -d bot.sa-it.fr -d www.bot.sa-it.fr
```

> Renouvellement automatique :  
```bash
sudo certbot renew --dry-run
```

---

## 🔁 Commandes utiles

| Action                  | Commande                         |
|------------------------|----------------------------------|
| Lancer l’app avec PM2  | `pm2 start start.js --name mee6` |
| Redémarrer             | `pm2 restart mee6`               |
| Logs                   | `pm2 logs mee6`                  |
| Supprimer              | `pm2 delete mee6`                |

---

## 🧪 Test

Accède à ton site :
```
https://bot.sa-it.fr
```

Clique sur **Se connecter avec Discord**, puis :
- L’auth OAuth2 se déclenche
- Les serveurs sont listés
- Le lien pour ajouter le bot fonctionne

---

## ✅ Sécurité

- Utilise HTTPS partout
- Stocke tes secrets dans `.env`
- Ne commit jamais `.env` ou tes clés privées

---

## 📁 Structure du projet

```
projetMee6/
├── certbot/           # Certificats Let's Encrypt
├── website/public/    # Frontend HTML/CSS/JS
├── start.js           # Serveur Express (Node.js)
├── .env               # Variables secrètes (non commit)
├── nginx.conf         # (optionnel)
└── Dockerfile         # (si besoin plus tard)
```

---

## 📬 Contact

Pour toute question ou contribution, ouvre une issue ou contacte Sam 👨‍💻
