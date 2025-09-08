# 0 - Installatie

In dit hoofdstuk zullen we de ontwikkelomgeving voor het project opzetten. We leiden je door de stappen om de benodigde tools en bibliotheken te installeren, zodat je in het volgende hoofdstuk [(1 - Svelte)](/tutorial/1-svelte/README.md) met het project kunt beginnen.

## Hoofdstukoverzicht
### Leerdoelen

Aan het einde van dit hoofdstuk ben je in staat om:
- (Voor Windows-gebruikers:) Windows Subsystem for Linux (WSL) te installeren op je Windows-machine.
- Een GitHub repository op te zetten en je apparaat te authenticeren om code te klonen en te pushen via SSH.
- Node.js en npm te installeren in je WSL-omgeving.
- Een lokale MySQL-database op te zetten met XAMPP (of specifieker, LAMPP).
- Een nieuw Svelte-project aan te maken met behulp van de CLI.

### Leermiddelen
- [Windows Subsystem for Linux (WSL) Installation Guide](https://docs.microsoft.com/en-us/windows/wsl/install)
- [GitHub SSH Authentication Guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [Node.js Installation Guide](https://nodejs.org/en/download/)
- [XAMPP / LAMPP](https://www.apachefriends.org/index.html)
- [Svelte documentation](https://svelte.dev/docs)
- [Command Line Crash Course](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line)
- [Codecademy's Command Line Course](https://www.codecademy.com/learn/learn-the-command-line)
- [The Coding Train's Video on the Shell](https://www.youtube.com/watch?v=FnkkzgYuXUM)

## WSL installeren

Als je al een **Linux-gebaseerd OS** gebruikt, kun je deze sectie overslaan. **macOS-gebruikers** kunnen doorgaan, maar moeten zich ervan bewust zijn dat deze tutorial is geschreven met Linux in gedachten, dus sommige commando's en tools kunnen verschillen.

Als je **Windows** gebruikt, is het tijd om vertrouwd te raken met een Unix-gebaseerde omgeving, aangezien dat het OS is waar het grootste deel van het web op draait. We geven je een globaal overzicht van hoe je het **Windows Subsystem for Linux (WSL)** kunt installeren om een Linux-distributie op je Windows-machine te draaien.

> ⚠️Het valt buiten het bestek van deze tutorial om gedetailleerd in te gaan op interactie met WSL. We gaan ervan uit dat je bekend bent met de basisbeginselen van het gebruik van de shell in een Unix-omgeving. Als dat niet het geval is, raden we je aan om de [Command Line Crash Course](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line) van Mozilla te raadplegen, of een vergelijkbare bron, zoals [Codecademy's Command Line Course](https://www.codecademy.com/learn/learn-the-command-line), of, als je meer een visuele leerling bent, [deze prachtige video](https://www.youtube.com/watch?v=FnkkzgYuXUM) van The Coding Train.

> ℹ️ Ik raad je aan om [Windows Terminal](https://github.com/microsoft/terminal) of [Wezterm](https://wezterm.org/index.html) als je terminal emulator te gebruiken, maar maak je hier niet al te veel zorgen over: het komt allemaal neer op persoonlijke voorkeur, en elke terminal emulator zou prima moeten zijn!

### Installatiestappen

Raadpleeg altijd de [nieuwste instructies](https://learn.microsoft.com/en-us/windows/wsl/install) in de officiële Microsoft-documentatie, maar hier zijn de algemene stappen om WSL te installeren:

1. **Open CMD of PowerShell als administrator**: Zoek naar "cmd" of "PowerShell" in het Startmenu, klik met de rechtermuisknop en selecteer "Als administrator uitvoeren".
2. **Installeer WSL**:
    Voer het volgende commando uit:
    ```
    wsl --install
    ```
    Dit installeert de standaard WSL-distributie (meestal Ubuntu).

3. Herstart je computer wanneer daarom wordt gevraagd.

4. Om te bevestigen dat alles werkt: probeer WSL te openen door `wsl` te typen in de opdrachtprompt of PowerShell. Dit zou een nieuwe shell-sessie moeten starten in je geïnstalleerde Linux-distributie.

    > ℹ️ Je wordt mogelijk gevraagd een nieuwe gebruiker en wachtwoord aan te maken voor je Linux-omgeving. Gebruik een gebruikersnaam en wachtwoord die je kan onthouden, want je zult ze later nodig hebben. Je zult dit wachtwoord vaak invoeren, dus zorg ervoor dat het [iets sterks, maar memorabels](https://xkcd.com/936/) is.

5. Het is een goed idee om je 'package list' bij te werken en de geïnstalleerde *packages* te upgraden. Voer de volgende commando's uit in je WSL shell:
    ```bash
    sudo apt update && sudo apt upgrade -y
    ```
    Dit zorgt ervoor dat je de nieuwste updates voor je Linux-distributie hebt.

`sudo apt update` werkt de package list bij met behulp van de `apt` package manager (de standaard package manager voor Ubuntu en andere Debian-gebaseerde distributies). De `&&`-operator stelt ons in staat om commando's aan elkaar te koppelen, en `sudo apt upgrade -y` werkt alle geïnstalleerde packages bij naar hun nieuwste versies, waarbij de `-y` flag automatisch alle prompts bevestigt.

> ℹ️ Als je geen idee hebt wat `sudo` hier doet, is het waarschijnlijk een goed idee om eerst de hierboven genoemde terminal basics cursussen te bekijken.

Mooi. Vanaf nu zullen alle verdere commando's die je in deze tutorial ziet, worden uitgevoerd in de WSL shell. Probeer het niet te verwarren met de Windows-command prompt, of PowerShell. Mocht je je terminalvenster sluiten, dan moet je WSL opnieuw openen door `wsl` te typen.

### Je Windows-bestanden vinden in WSL, en vice versa.

**WSL -> Windows**

Je kunt je **Windows-bestanden vanuit WSL** benaderen door te navigeren via de `/mnt/` directory. Probeer de inhoud van je `/mnt/` directory te listen:

```bash
ls /mnt/
````

Je zult waarschijnlijk directories zoals `c`, `d`, enz. zien, die overeenkomen met je Windows-schijven. Bijvoorbeeld, je C:-schijf bevindt zich op `/mnt/c/`. Een beetje tab-autocompletion doet hier wonderen.

**Windows -\> WSL**

Mocht je in plaats daarvan je **WSL**-bestanden vanuit Windows willen benaderen, dan kan dat door naar de speciale URI `\\wsl$\` te navigeren in Windows Verkenner.
Je WSL-home directory bevindt zich op `\\wsl$\Ubuntu\home\<je-gebruikersnaam>` (vervang `Ubuntu` door de naam van je WSL-distributie, indien anders). Je kunt ook andere directories in je WSL-bestandssysteem benaderen vanuit Windows Verkenner.

### WSL-bestanden bewerken vanuit Windows (en vice versa)

Bij voorkeur bewerk je bestanden in je WSL-omgeving direct met WSL, en je Windows-bestanden direct met Windows. Het door elkaar gebruiken *kan*, maar dit kan leiden tot problemen met prestaties en bestandspermissies.

De eerste aanbeveling zou zijn om een terminal-gebaseerde editor zoals `neovim` [(link)](https://neovim.io/) te gebruiken om WSL-bestanden direct vanuit de WSL shell te bewerken. (Sterker nog, ik grijp deze gelegenheid aan om je *sterk* aan te bevelen `neovim` als je primaire teksteditor te leren gebruiken *(of op zijn minst [VIM motions](https://www.barbarianmeetscoding.com/boost-your-coding-fu-with-vscode-and-vim/moving-blazingly-fast-with-the-core-vim-motions/) die ook in tal van andere editors die je al kent gebruikt kunnen worden).* Maar de waarheid is, dat er achter VIM motions en het gebruik van neovim in het algemeen een nogal een stijle leercurve zit, dus overweeg deze aanbeveling serieus, maar het kan zomaar eens de beste optie zijn om dat maar even uit te stellen...)

Een andere solide (hoewel technisch gezien regelbrekende) optie is om een grafische code-editor zoals [Visual Studio Code](https://code.visualstudio.com/) of [JetBrains IDEs](https://www.jetbrains.com/products.html) vanuit Windows te draaien, en je projectmap (in de WSL-map) direct in die editors te openen, met behulp van het hierboven vermelde WSL-pad. Nogmaals, dit wordt *technisch* afgeraden, maar het werkt goed genoeg voor deze tutorial. Dus: heb je geen zin om de *tinkeren*, is dat waarschijnlijk je beste optie!

## Git en GitHub instellen

In deze sectie zullen we Git op onze (WSL) machine instellen, een repository op GitHub opzetten en ons apparaat via SSH authenticeren bij GitHub. Dit stelt ons in staat om code te klonen en te pushen naar onze GitHub-repositories.

> ℹ️ Heb je Git al op Windows geïnstalleerd, dan moet je alsnog Git installeren op WSL.

### Git installeren

Git is vooraf geïnstalleerd op de meeste Linux-distributies, maar laten we ervoor zorgen dat je het geïnstalleerd hebt. Open je terminal en voer het volgende commando uit:

```bash
git --version
```

  - Als Git is geïnstalleerd, *returned* dit commando het versienummer van Git. [Kijk of je de nieuwste versie hebt](https://git-scm.com/). Zo niet, dan is het waarschijnlijk een goed idee om Git nu bij te werken.
  - Als het niet is geïnstalleerd, *returned* het commando iets als `command not found: git`.

Om Git bij te werken of te installeren, voer je uit:

```bash
sudo apt update && sudo apt install git
```

> ℹ️ Als je een niet-Debian-gebaseerde Linux-distributie of macOS gebruikt, kunnen de package manager en het installatiecommando verschillen. Raadpleeg de documentatie van je distributie voor het juiste commando.

Nu Git is geïnstalleerd, zou je iets terug moeten krijgen uit het commando `which git`, of `git --version` kunnen uitvoeren om de geïnstalleerde versie van Git te zien.

### Git configureren

Oké, nu we Git hebben geïnstalleerd, gaan we het configureren met je naam en e-mailadres. Dit is belangrijk omdat Git deze informatie gebruikt om te identificeren wie wijzigingen in de code heeft aangebracht.

Voer de volgende commando's uit in je terminal:

```bash
git config --global user.name "<Mijn Naam>"
git config --global user.email "<mijn@email.com>"
```

> ℹ️ Vervang `<Mijn Naam>` en `<mijn@email.com>` door je naam en e-mailadres (Je gebruikt waarschijnlijk hetzelfde e-mailadres als waarmee je inlogt op GitHub).

Nu Git weet wie we zijn, kunnen we verder gaan met het opzetten van een GitHub-repository.

### Een GitHub repository opzetten

Voor dit project willen we gewoon een lege repository om mee te beginnen.

  - [ ] Noem het `svelte-db-portal` (voel je vrij om je eigen memorabele naam te bedenken).
  - [ ] Geef het een beknopte beschrijving, zoals "Een Svelte webapplicatie voor het visualiseren van gegevens uit een MySQL-database".
  - [ ] Zet het voor nu op `private`, zodat alleen jij er toegang toe hebt.
  - [ ] Initialiseer het niet met een README, .gitignore of license-bestand, want dat doen we later.

> ℹ️ Raadpleeg de [GitHub-documentatie](https://docs.github.com/en/get-started/quickstart/create-a-repo) voor meer informatie over het aanmaken van een nieuwe repository.

Mooi, we hebben nu een lege repository die we kunnen gebruiken om onze code te version control.

We kunnen proberen het te klonen naar onze lokale machine door op de groene "Code"-knop op de repositorypagina te klikken en de **SSH URL** te kopiëren. Nu kunnen we het klonen naar elke directory op onze lokale machine. Laten we een werkdirectory aanmaken in onze home directory, en de repository daarheen klonen.

```bash
# Maak een directory genaamd 'work' in onze home directory
mkdir -p ~/work
# Ga naar de 'work' directory
cd ~/work
# Kloon de repository via SSH
git clone git@github.com:mijngebruikersnaam/mijnreponaam.git
```

Oeps\! Op dit punt krijg je misschien een foutmelding, zoiets als `Permission denied`. We hebben onze machine nog niet ingesteld om te authenticeren met GitHub, dus we hebben geen toegang tot onze repository. Laten we dat oplossen in de volgende sectie.

### Authenticeren met GitHub via SSH

Nu we een repository hebben, moeten we ons apparaat authenticeren bij GitHub, zodat ons apparaat is toegestaan om code te klonen en te pushen naar de repository. We doen dit met behulp van SSH, een veilige manier om verbinding te maken met externe servers.

Om te authenticeren met GitHub via SSH, raadpleeg de nieuwste instructies in de [GitHub SSH Authentication Guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh). Specifiek zijn de secties [Generating a new SSH key and adding it to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) en [Adding a new SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account) het meest relevant.

Hoewel de instructies vrij gedetailleerd zijn (en in de loop van de tijd kunnen veranderen), is hier een snelle samenvatting van de stappen die je moet nemen:

1.  [ ] Genereer een nieuwe SSH-sleutel: `ssh-keygen -t ed25519 -C "mijn@email.com"`
      - Druk op Enter om de standaard bestandslocatie te accepteren.
      - Druk nogmaals op Enter om het wachtwoord leeg te laten (of stel een wachtwoord in als je dat per se wilt).
      - Druk op Enter om het wachtwoord te bevestigen (als je er een hebt ingesteld).
2.  [ ] Start de SSH-agent: `eval "$(ssh-agent -s)"`
      - Het zou zoiets als `Agent pid 1234` moeten teruggeven.
3.  [ ] Voeg je SSH-sleutel toe aan de SSH-agent: `ssh-add ~/.ssh/id_ed25519` (of het bestand dat je in stap 1 hebt opgegeven).
4.  [ ] Bekijk je publieke sleutel: `cat ~/.ssh/id_ed25519.pub`
      - Kopieer de uitvoer van dit commando naar je klembord.
5.  [ ] Voeg de publieke sleutel toe aan je GitHub-account:
      - Ga naar je Instellingenpagina op GitHub.
      - Klik in de linkerzijbalk op "SSH and GPG keys".
      - Klik op "New SSH key".
      - Geef het een titel (bijv. "Mijn Laptop SSH-sleutel") en plak de publieke sleutel die je eerder hebt gekopieerd in het veld "Key".
      - Klik op "Add SSH key" om het op te slaan.

> ℹ️ Terminal emulators hebben meestal een manier om tekst te kopiëren anders dan CTRL+C, omdat dat gereserveerd is voor het verzenden van een interruptsignaal aan het proces dat in de terminal draait. Je kunt bijvoorbeeld CTRL+SHIFT+C gebruiken in de meeste terminal emulators om tekst te kopiëren, of de tekst met je muis markeren en rechterklikken.

Nu we ons apparaat hebben geauthenticeerd bij GitHub, kunnen we proberen de repository opnieuw te klonen:

```bash
# Ga naar de 'work' directory (of waar je de repository ook wilt klonen)
cd ~/work
# Kloon de repository via SSH
git clone git@github.com:mijngebruikersnaam/mijnreponaam.git
# Toon de inhoud van de huidige directory om te zien of de repository succesvol is gekloond
ls
# Ga naar de gekloonde repository
cd mijnreponaam
```

> ℹ️ Mogelijk moet je de authenticiteit van de host (github.com) bevestigen door `yes` te typen wanneer daarom wordt gevraagd. Dit is een veiligheidsmaatregel om ervoor te zorgen dat je verbinding maakt met de juiste server.

Gefeliciteerd\! Je hebt je GitHub-repository succesvol gekloond naar je lokale machine. Je kunt nu beginnen met je project en wijzigingen terugpushen naar GitHub.

## Node.js en npm installeren

Oké, we hebben nu een GitHub repository ingesteld, en we kunnen er code naar pushen. We moeten nog een paar dingen instellen voordat we aan het echte werk kunnen beginnen. Om onze Svelte-applicatie uit te voeren, zullen we **Node.js** en **npm** (Node Package Manager) gebruiken.

  - **Node.js** is een JavaScript runtime waarmee we JavaScript-code buiten een webbrowser kunnen uitvoeren.
  - **npm** is een package manager voor Node.js waarmee we libraries en tools kunnen installeren en beheren die we in ons project zullen gebruiken.
  - Node en npm worden meestal gebundeld, dus wanneer je Node.js installeert, krijg je ook npm geïnstalleerd.

De eenvoudigste manier om Node.js en npm te installeren is door gebruik te maken van de **Node Version Manager (nvm)**, waarmee je eenvoudig meerdere versies van Node.js op je machine kunt installeren en beheren.

Raadpleeg de [Node.js installatiehandleiding](https://nodejs.org/en/download) voor de meest recente instructies.

> ⚠️ WSL-gebruikers moeten zich ervan bewust zijn dat je de Linux-instructies moet volgen, niet de Windows-instructies.

## XAMPP (of LAMPP) installeren

Met Git en Node.js ingesteld, moeten we nu XAMPP installeren (of preciezer, LAMPP, wat de Linux-versie van XAMPP is).

XAMPP is een gratis en open-source cross-platform webserveroplossingspakket ontwikkeld door Apache Friends, voornamelijk bestaande uit de Apache HTTP Server, MariaDB (of MySQL), en interpreters voor scripts geschreven in de programmeertalen PHP en Perl.

We zullen XAMPP gebruiken om een lokale MySQL-database te draaien en onze database te bekijken en te wijzigen met behulp van een GUI-tool genaamd phpMyAdmin.
Merk op dat je technisch gezien elke MySQL-server voor dit project kunt gebruiken, maar XAMPP is een populaire keuze voor beginners, omdat het gemakkelijk is in te stellen en te gebruiken.

> ℹ️ Voor de leergierigen: Technisch gezien zullen we MariaDB installeren, wat niet precies hetzelfde is als MySQL, maar het functioneert grotendeels als een drop-in vervanging voor MySQL, dus we zullen het in deze tutorial voor de eenvoud en bekendheid MySQL noemen, net zoals XAMPP dat doet.

Om XAMPP te installeren, download je de nieuwste versie voor Linux van de [Apache Friends website](https://www.apachefriends.org/).

> ℹ️ WSL-gebruikers: Gebruik `wget` als je weet hoe dat werkt. Zo niet, dan kun je het installatieprogramma downloaden met je webbrowser en het vervolgens verplaatsen van je Windows-bestandssysteem naar je WSL-directory met het `mv`-commando. Je hebt toegang tot het Windows-bestandssysteem vanuit WSL door te navigeren naar `/mnt/c/` voor de C:-schijf. Dus, als je het installatieprogramma hebt gedownload naar je Downloads-map in Windows, kun je het naar je WSL-home directory verplaatsen met commando's die vergelijkbaar zijn met de volgende:

```bash
mkdir -p ~/Downloads
mv /mnt/c/Users/MyUsername/Downloads/xampp-linux-*installer.run ~/Downloads/
# Let op: als je spaties in je pad hebt (zoals in de gebruikersnaam), moet je het pad tussen aanhalingstekens plaatsen of escapen met een backslash (\).
# Autocompleting met TAB is hier handig.
```

Nu we het installatieprogramma hebben gedownload, moeten we het uitvoeren. Maar daarvoor moeten we eerst de bestandsrechten aanpassen zodat we het mogen uitvoeren. Dit kunnen we doen met `chmod`:

```bash
# Ga naar de directory waar het installatieprogramma zich bevindt
cd ~/Downloads
chmod +x ./xampp-linux-*installer.run    # +x betekent 'uitvoeringsrechten toevoegen' (x van eXecute)
```

Nu de uitvoeringsrechten zijn ingesteld, kunnen we de installer uitvoeren:

```bash
sudo ./xampp-linux-*installer.run
```

> ℹ️ Deze installatie kan even duren, dus wees geduldig.

Controleer of de installatie succesvol was door het volgende commando uit te voeren:

```bash
sudo /opt/lampp/lampp status
```

Dit zou de status van de XAMPP-services moeten teruggeven, zoals Apache en MySQL. Als alles draait, zou je iets moeten zien als:

```
Version: XAMPP for Linux 8.1.12-0
Apache is not running.
MySQL is not running.
ProFTPD is not running.
```

We kunnen proberen de services te starten door het volgende uit te voeren:

```bash
sudo /opt/lampp/lampp start
```

Geweldig - het lijkt erop dat we bijna klaar zijn met de installatie\! We hoeven alleen nog ons Svelte-project aan te maken.

## Een nieuw Svelte-project aanmaken

Om onze `Svelte`-app te maken, gebruiken we `SvelteKit`. In het volgende hoofdstuk gaan we dieper in op waarom we Svelte(Kit) gebruiken, maar voor nu zetten we gewoon het project op.

Laten we eerst naar onze repository gaan.

```bash
cd ~/work/svelte-db-portal
```

Nu zullen we onze Svelte-app maken met behulp van de `sv` CLI, die we kunnen uitvoeren met `npx` (dat wordt geleverd met `npm`. `npx` stelt ons in staat om commando's van `npm`-pakketten uit te voeren zonder ze globaal te installeren):

```bash
npx sv create app     # 'app' is gewoon de naam van onze app. Voel je vrij om het te veranderen in iets anders.
```

Je krijgt een paar opties voorgeschoteld.

  - [ ] Kies een template: Selecteer `Skeleton project` voor een minimale setup.
  - [ ] Gebruik TypeScript syntax: Kies `Yes`, aangezien we TypeScript in dit project zullen gebruiken.
  - [ ] Voor plugins, vink aan:
      - [ ] `ESLint`, een linter voor JavaScript en TypeScript code.
      - [ ] `Prettier`, een 'opinionated' code formatter.
      - [ ] `Tailwind CSS`, een utility-first CSS framework.
      - [ ] `Drizzle`, een ORM voor TypeScript en JavaScript.
  - [ ] Voeg voorlopig geen tailwind plugins toe.
  - [ ] Kies de MySQL database voor Drizzle.
  - [ ] Kies de mysql2 driver voor Drizzle.
  - [ ] Draai de database niet met docker-compose (aangezien we XAMPP zullen gebruiken).
  - [ ] Gebruik `npm` om de Drizzle dependencies te installeren.

> ℹ️ Als je niet bekend bent met een van deze tools, maak je geen zorgen\! We zullen ze later gedetailleerder uitleggen. Selecteer voor nu gewoon de opties zoals hierboven beschreven.

Je log zou er ongeveer zo uit moeten zien:

![npx-sv-log.png](/tutorial/0-setup/img/npx-sv-log.png)

Controleer of alles correct is geïnstalleerd door de Svelte ontwikkelserver te draaien:

```bash
cd my-app
npm i # Installeer de dependencies (moet door sv gebeuren, maar voor de zekerheid)
npm run dev # Start de ontwikkelserver
```

Bezoek nu [`http://localhost:5173`](https://www.google.com/search?q=http://localhost:5173) in je webbrowser. Je zou een Svelte welkomspagina moeten zien, wat betekent dat alles correct is ingesteld\!

Beëindig de ontwikkelserver met `CTRL+C`, Ga één directory omhoog (naar de root van je repository), en commit ons nieuwe project:

```bash
cd ..
git add .
git commit -m "Init Svelte project"
git push origin main
```

Gefeliciteerd\! Je hebt je eerste Svelte-app succesvol opgezet.

## Editor plugins

Om je ontwikkelervaring soepeler te maken, raden we aan om enkele plugins voor je code-editor te installeren.

Als je een andere code-editor gebruikt dan de hieronder vermelde, zoek dan naar vergelijkbare plugins die Svelte-, ESLint-, Prettier- en Tailwind CSS-ondersteuning bieden.

  - **VSCode**:

      - [Svelte for VSCode](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode): Svelte taalondersteuning.
      - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint): Linting-ondersteuning voor JavaScript en TypeScript.
      - [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): Codeformatteringsondersteuning.
      - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss): Tailwind CSS-ondersteuning.

  - **Neovim**:

      - (Een goed startpunt voor Neovim-configuratie is [kickstart-modular](https://github.com/dam9000/kickstart-modular.nvim))
      - Installeer de volgende language servers (bijv. met behulp van `lspconfig` uit het kickstart-voorbeeld):
          - `eslint-lsp`
          - `prettier`
          - `svelte-language-server`
          - `tailwindcss-language-server`
          - `typescript-language-server`

## Samenvatting

Ter afsluiting hebben we:

  - WSL geïnstalleerd op onze Windows-machine (of een Linux-gebaseerd OS gebruikt).
  - Git en GitHub opgezet en ons apparaat geauthenticeerd bij GitHub met behulp van SSH.
  - Node.js en npm geïnstalleerd met behulp van nvm.
  - XAMPP (of LAMPP) geïnstalleerd om een lokale MySQL-database te draaien.
  - Een nieuw Svelte-project aangemaakt met de Svelte CLI.
  - Ons initiële project naar GitHub gepusht.
  - Enkele handige editor plugins geïnstalleerd om onze ontwikkelervaring te verbeteren.

In het [volgende hoofdstuk](/tutorial/1-svelte/README-nl.md) beginnen we met het bouwen van de basisstructuur voor onze Svelte-applicatie.
