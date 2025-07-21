function initWelcomeModule() {
  const container = document.getElementById('module-welcome');
  if (!container) return;
  const fields = container.querySelectorAll('[data-field]');
  fields.forEach(field => {
    field.addEventListener('input', () => checkChanges('module-welcome'));
    field.addEventListener('change', () => checkChanges('module-welcome'));
  });
  // Stocke l'état initial
  if (typeof storeInitialState === "function") {
    storeInitialState('module-welcome');
  }
}

document.addEventListener('DOMContentLoaded', () => {
    updateSelectPrompt("role");
    updateSelectPrompt("channel");
    });

function updateRoleSelectionVisibility() {
  if (assignRoleCheckbox.checked) {
    welcomeRoleListContainer.classList.remove('hidden');
    selectedRoles.setAttribute('data-required', 'true');
  } else {
    welcomeRoleListContainer.classList.add('hidden');
    selectedRoles.removeAttribute('data-required');
  }
}

if (assignRoleCheckbox && welcomeRoleListContainer && selectedRoles) {
  assignRoleCheckbox.addEventListener('change', updateRoleSelectionVisibility);
  // Initialise l'affichage au chargement
  updateRoleSelectionVisibility();
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const targetId = `module-${button.dataset.module}`;
        modules.forEach(mod => mod.classList.add('hidden'));
        const targetModule = document.getElementById(targetId);

        // Si c'est le module welcome et qu'il n'a pas encore été chargé, fetch le HTML
        if (targetId === 'module-welcome' && !targetModule.dataset.loaded) {
        fetch('../composants/modules/memberUpdate.html')
            .then(res => res.text())
            .then(html => {
                const targetModule = document.getElementById('module-welcome');
                targetModule.innerHTML = html;
                targetModule.dataset.loaded = "true";
                targetModule.classList.remove('hidden');

                // Ajoute les écouteurs sur les champs du module welcome
                const fields = targetModule.querySelectorAll('[data-field]');
                    fields.forEach(field => {
                    field.addEventListener('input', () => checkChanges('module-welcome'));
                    field.addEventListener('change', () => checkChanges('module-welcome'));
                });
                const moduleId = 'module-welcome';
                const container = document.getElementById(moduleId);
                if (container) {
                    container.querySelectorAll('[data-field]').forEach(field => {
                        field.addEventListener('input', () => checkChanges(moduleId));
                        field.addEventListener('change', () => checkChanges(moduleId));
                    });
                    // Stocke l'état initial
                    storeInitialState(moduleId);
                }
            });
        } else {
        targetModule.classList.remove('hidden');
        }

        

        buttons.forEach(b => b.classList.remove('bg-gray-800'));
        button.classList.add('bg-gray-800');
    });
    });

    // Affiche ou masque les champs des modules activés
    document.getElementById('toggle-welcome')?.addEventListener('change', e => {
    document.getElementById('welcome-config')?.classList.toggle('hidden', !e.target.checked);
    });

    document.getElementById('toggle-leave')?.addEventListener('change', e => {
    document.getElementById('leave-config')?.classList.toggle('hidden', !e.target.checked);
    });

    // Sidebar : affichage du module actif
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const moduleKey = button.dataset.module;
            const moduleId = `module-${moduleKey}`;
            currentModuleId = moduleId;

            // Affiche le bon module
            modules.forEach(mod => mod.classList.add('hidden'));
            document.getElementById(moduleId)?.classList.remove('hidden');

            // Applique style bouton
            buttons.forEach(b => b.classList.remove('bg-gray-800'));
            button.classList.add('bg-gray-800');

            // Stocke l’état initial
            setTimeout(() => storeInitialState(moduleId), 0);
        });
    });
    
    // Dropdown rôles
    const addRoleBtn = document.getElementById('addWelcomeRole');
    const roleDropdown = document.getElementById('roleDropdown');
    const roleOptions = document.getElementById('roleOptions');
    let allRoles = [];

    addRoleBtn.addEventListener('click', async () => {
    const guildId = localStorage.getItem('activeGuildId') || document.getElementById('guildData').dataset.guildId;
    if (!guildId) return alert("Veuillez d'abord sélectionner un serveur.");

    // Toggle dropdown
    roleDropdown.classList.toggle('hidden');

    // Si déjà chargé, pas besoin de refetch
    if (allRoles.length > 0) return;

    try {
        const res = await fetch(`/dashboard/guilds/${guildId}/roles`);
        if (!res.ok) {
        const { error } = await res.json();
        return alert(`Erreur : ${error}`);
        }

        allRoles = await res.json();
        roleOptions.innerHTML = '';

        allRoles.forEach(role => {
        const li = document.createElement('li');
        li.textContent = role.name + (role.managed ? ' (géré)' : '');
        li.className = "px-4 py-2 hover:bg-white/10 cursor-pointer transition";
        li.dataset.roleId = role.id;

        li.addEventListener('click', () => {
            ajouterItem(role, "role");
            roleDropdown.classList.add('hidden');
        });

        roleOptions.appendChild(li);
        });

    } catch (err) {
        console.error(err);
        alert("Erreur lors du chargement des rôles.");
    }
    });

    // Dropdown salons
    const addChannelBtn = document.getElementById('addWelcomeChannel');
    const channelDropdown = document.getElementById('channelDropdown');
    const channelOptions = document.getElementById('channelOptions');
    let allChannels = [];

    addChannelBtn.addEventListener('click', async () => {
    const guildId = localStorage.getItem('activeGuildId') || document.getElementById('guildData').dataset.guildId;
    if (!guildId) return alert("Veuillez d'abord sélectionner un serveur.");

    // Toggle dropdown
    channelDropdown.classList.toggle('hidden');

    // Si déjà chargé, pas besoin de refetch
    if (allChannels.length > 0) return;

    try {
        const res = await fetch(`/dashboard/guilds/${guildId}/salons`);
        if (!res.ok) {
        const { error } = await res.json();
        return alert(`Erreur : ${error}`);
        }

        allChannels = await res.json();
        channelOptions.innerHTML = '';

        allChannels.forEach(channel => {
        const li = document.createElement('li');
        li.textContent = channel.name;
        li.className = "px-4 py-2 hover:bg-white/10 cursor-pointer transition";
        li.dataset.channelId = channel.id;

        li.addEventListener('click', () => {
            ajouterItem(channel, "channel");
            channelDropdown.classList.add('hidden');
        });

        channelOptions.appendChild(li);
        });

    } catch (err) {
        console.error(err);
        alert("Erreur lors du chargement des salons.");
    }
    });

    function updateSelectPrompt(type = "role") {
    // Détermine l'ID de la liste selon le type
    const listId = type === "role" ? 'selectedRoles' : 'selectedChannels';
    const selectedList = document.getElementById(listId);
    if (!selectedList) return;

    // Supprime les anciens prompts
    const oldPrompt = selectedList.querySelector('.select-' + type + '-placeholder');
    if (oldPrompt) oldPrompt.remove();

    // Vérifie s'il y a des éléments sélectionnés
    const dataAttr = type === "role" ? 'data-role-id' : 'data-channel-id';
    const hasItems = selectedList.querySelectorAll(`[${dataAttr}]`).length > 0;

    if (!hasItems) {
        const li = document.createElement('li');
        li.className = `text-gray-400 select-${type}-placeholder`;
        li.textContent = `Sélectionner un ${type}`;
        selectedList.appendChild(li);
    }
    }

    // Fonction d’ajout de rôle dans la liste
    function ajouterItem(item, type = "role") {
    // type = "role" ou "channel"
    const listId = type === "role" ? 'selectedRoles' : 'selectedChannels';
    const selectedList = document.getElementById(listId);
    if (!selectedList) return;

    // Ne rien faire si déjà présent
    if (selectedList.querySelector(`[data-${type}-id="${item.id}"]`)) return;

    // Crée l'élément LI
    const elem = document.createElement('li');
    elem.className = "bg-white/10 px-2 py-1 rounded-full text-sm flex items-center gap-2";
    elem.dataset[`${type}Id`] = item.id;

    elem.innerHTML = `
        <span>${item.name}</span>
        <button class="text-red-400 hover:text-red-600" title="Supprimer">×</button>
    `;

    elem.querySelector('button').addEventListener('click', () => {
        elem.remove();
        updateSelectPrompt(type);
    });

    selectedList.appendChild(elem);
    updateSelectPrompt(type);
    }

    
