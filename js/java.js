/**
 * @fileoverview Módulo Central de Gerenciamento de Tarefas - TaskLy
 * 
 * Este arquivo é o núcleo da aplicação TaskLy, responsável por gerenciar a criação de novas tarefas,
 * controlar modais de interface, distribuir tarefas entre diferentes seções e configurar navegação.
 * 
 * @author Gabrielle de Araujo Oliveira, Daniel Augusto Suman De Carvalho 
 * @version 1.0.0
 * @since 2025
 * 
 * PRINCIPAIS FUNCIONALIDADES:
 * 
 *  CONTROLE DE MODAL:
 * - Abertura e fechamento do modal de nova tarefa
 * - Validação e submissão de formulários
 * - Limpeza automática de dados temporários
 * - Fechamento por clique externo ou botão cancelar
 * 
 *   CRIAÇÃO DE TAREFAS:
 * - Coleta de dados do formulário (título, descrição, prazo, prioridade, categoria)
 * - Distribuição automática para seções apropriadas
 * - Geração de elementos HTML dinâmicos
 * - Persistência no localStorage para seção "Hoje"
 * 
 *   SISTEMA DE CATEGORIZAÇÃO:
 * - 'hoje': Tarefas para o dia atual (com funcionalidades avançadas)
 * - 'tarefasDoDia': Seção geral de tarefas
 * - 'prox': Tarefas futuras/próximas
 * - 'projetos': Tarefas relacionadas a projetos
 * 
 *   NAVEGAÇÃO ENTRE PÁGINAS:
 * - Redirecionamento por clique em cards
 * - Navegação para tarefas.html, hoje.html, prox.html, projetos.html
 * - Event listeners configurados para cada seção
 * 
 *   PERSISTÊNCIA DE DADOS:
 * - Armazenamento especial no localStorage para tarefas "Hoje"
 * - Geração de IDs únicos baseados em timestamp
 * - Estrutura de dados padronizada para todas as tarefas
 * 
 * ELEMENTOS DOM PRINCIPAIS:
 * - #modalNovaTarefa: Modal container para formulário
 * - #novaTarefaBtn: Botão para abrir modal
 * - #cancelarBtn: Botão para cancelar criação
 * - #formNovaTarefa: Formulário de dados da tarefa
 * - .box, .Hoje, .prox, .projetos: Containers das seções
 * 
 * @example
 * // O módulo é inicializado automaticamente quando carregado
 * // Principais interações do usuário:
 * // 1. Clicar no botão "Nova Tarefa" abre o modal
 * // 2. Preencher formulário e submeter cria a tarefa
 * // 3. Clicar nos cards navega entre seções
 * 
 * // Estrutura típica de tarefa criada:
 * const exemploTarefa = {
 *   titulo: "Estudar JavaScript",
 *   descricao: "Revisar conceitos de DOM",
 *   prazo: "2025-01-15",
 *   prioridade: "alta",
 *   categoria: "hoje"
 * };
 */

// SISTEMA DE CONTROLE DE MODAL - Gerencia abertura, fechamento e submissão do formulário de nova tarefa
const modal = document.getElementById('modalNovaTarefa'); // SELEÇÃO DO MODAL - Elemento popup que contém o formulário
const btnNovaTarefa = document.getElementById('novaTarefaBtn'); // BOTÃO DE ABERTURA - Elemento que ativa a exibição do modal
const btnCancelar = document.getElementById('cancelarBtn'); // BOTÃO DE CANCELAMENTO - Elemento que fecha modal sem salvar
const form = document.getElementById('formNovaTarefa'); // FORMULÁRIO PRINCIPAL - Elemento que coleta dados da nova tarefa

// EVENTO DE ABERTURA DO MODAL - Configura ação para exibir formulário de nova tarefa
if (btnNovaTarefa && modal) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma que elementos estão presentes no DOM
    btnNovaTarefa.addEventListener('click', function() { // LISTENER DE CLIQUE - Detecta interação do usuário
        modal.style.display = 'block'; // EXIBIÇÃO VISUAL - Torna modal visível alterando propriedade CSS
    });
}

// EVENTO DE CANCELAMENTO - Configura fechamento do modal sem salvar dados
if (btnCancelar && modal && form) { // VERIFICAÇÃO TRIPLA - Confirma existência de botão, modal e formulário
    btnCancelar.addEventListener('click', function() { // LISTENER DE CANCELAMENTO - Detecta clique no botão cancelar
        modal.style.display = 'none'; // OCULTAÇÃO VISUAL - Esconde modal alterando propriedade CSS
        form.reset(); // LIMPEZA DE DADOS - Remove todos os valores inseridos no formulário
    });
}

// EVENTO DE FECHAMENTO POR CLIQUE EXTERNO - Permite fechar modal clicando na área escura ao redor
if (modal && form) { // VERIFICAÇÃO DUPLA - Confirma existência de modal e formulário
    window.addEventListener('click', function(event) { // LISTENER GLOBAL - Monitora cliques em toda a janela
        if (event.target === modal) { // DETECÇÃO DE ÁREA - Verifica se clique foi na área externa do modal
            modal.style.display = 'none'; // OCULTAÇÃO VISUAL - Esconde modal por interação externa
            form.reset(); // LIMPEZA PREVENTIVA - Remove dados não salvos do formulário
        }
    });
}

// EVENTO DE SUBMISSÃO DO FORMULÁRIO - Processa criação de nova tarefa quando usuário confirma dados
if (form) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma que formulário está presente no DOM
    form.addEventListener('submit', function(event) { // LISTENER DE SUBMISSÃO - Intercepta envio do formulário
        event.preventDefault(); // PREVENÇÃO DE RELOAD - Impede recarregamento padrão da página

        // COLETA DE DADOS DO FORMULÁRIO - Extrai informações inseridas pelo usuário
        const formData = new FormData(form); // CRIAÇÃO DE OBJETO FormData - Facilita acesso aos campos
        const tarefa = { // ESTRUTURAÇÃO DE DADOS - Organiza informações em objeto JavaScript
            titulo: formData.get('titulo'), // EXTRAÇÃO DO TÍTULO - Campo obrigatório da tarefa
            descricao: formData.get('descricao'), // EXTRAÇÃO DA DESCRIÇÃO - Detalhes adicionais da tarefa
            prazo: formData.get('prazo'), // EXTRAÇÃO DO PRAZO - Data limite para conclusão
            prioridade: formData.get('prioridade'), // EXTRAÇÃO DA PRIORIDADE - Nível de importância
            categoria: formData.get('categoria') // EXTRAÇÃO DA CATEGORIA - Define onde tarefa será exibida
        };

        // PROCESSAMENTO DA TAREFA - Envia dados para função que determina localização no site
        adicionarTarefaAoContainer(tarefa); // CHAMADA DE FUNÇÃO - Distribui tarefa para seção apropriada

        console.log('Nova tarefa criada:', tarefa); // LOG DE DEPURAÇÃO - Registra criação no console do navegador
        alert('Tarefa criada com sucesso!'); // FEEDBACK VISUAL - Confirma sucesso da operação para usuário

        // FINALIZAÇÃO DO PROCESSO - Fecha interface e limpa dados temporários
        modal.style.display = 'none'; // OCULTAÇÃO DO MODAL - Esconde formulário após sucesso
        form.reset(); // LIMPEZA FINAL - Remove dados do formulário para próximo uso
    });
}

// FUNÇÃO DE DISTRIBUIÇÃO DE TAREFAS - Determina em qual seção do site a nova tarefa será exibida
function adicionarTarefaAoContainer(tarefa) {
    let containerSelector; // VARIÁVEL DE SELETOR - Armazenará o seletor CSS do container de destino

    // SISTEMA DE ROTEAMENTO POR CATEGORIA - Direciona tarefa para seção apropriada baseada na categoria escolhida
    switch(tarefa.categoria) { // ESTRUTURA DE DECISÃO - Avalia categoria selecionada pelo usuário
        case 'hoje': // CATEGORIA HOJE - Tarefas para o dia atual
            containerSelector = '.Hoje'; // SELETOR DA SEÇÃO HOJE - Define container de destino
            salvarTarefaHoje(tarefa); // PERSISTÊNCIA ESPECIAL - Salva no localStorage para funcionalidades avançadas
            break;
        case 'tarefasDoDia': // CATEGORIA TAREFAS DO DIA - Seção geral de tarefas
            containerSelector = '.box'; // SELETOR DA SEÇÃO PRINCIPAL - Container de tarefas gerais
            break;
        case 'prox': // CATEGORIA PRÓXIMAS - Tarefas futuras
            containerSelector = '.prox'; // SELETOR DA SEÇÃO PRÓXIMAS - Container de tarefas futuras
            break;
        case 'projetos': // CATEGORIA PROJETOS - Tarefas relacionadas a projetos
            containerSelector = '.projetos'; // SELETOR DA SEÇÃO PROJETOS - Container de projetos
            break;
        default: // CATEGORIA INVÁLIDA - Tratamento de erro
            return; // SAÍDA ANTECIPADA - Interrompe execução se categoria não reconhecida
    }

    // LOCALIZAÇÃO E CRIAÇÃO DO ELEMENTO - Encontra container de destino e cria elemento visual da tarefa
    const container = document.querySelector(containerSelector); // BUSCA NO DOM - Localiza elemento container usando seletor CSS
    if (container) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma que container foi encontrado
        // CRIAÇÃO DO ELEMENTO VISUAL - Constrói representação HTML da tarefa
        const tarefaElement = document.createElement('div'); // CRIAÇÃO DE ELEMENTO - Gera novo div para conter tarefa
        tarefaElement.className = 'tarefa-item-hoje'; // APLICAÇÃO DE ESTILO - Define classe CSS para formatação visual
        tarefaElement.innerHTML = ` // ESTRUTURAÇÃO DO CONTEÚDO - Define HTML interno com dados da tarefa
            <h4>${tarefa.titulo}</h4> // TÍTULO PRINCIPAL - Exibe nome da tarefa em destaque
            <p>${tarefa.descricao}</p> // DESCRIÇÃO DETALHADA - Mostra informações adicionais
            <small>Prazo: ${tarefa.prazo} | Prioridade: ${tarefa.prioridade}</small> // METADADOS - Exibe prazo e prioridade
        `;
        container.appendChild(tarefaElement); // INSERÇÃO NO DOM - Adiciona elemento criado ao container de destino
    }

    // NOTA: Os blocos abaixo parecem ser código duplicado que não deveria estar aqui
    // BLOCO DUPLICADO PARA PRÓXIMAS - Este código nunca será executado devido à lógica anterior
    if (container) { // VERIFICAÇÃO REDUNDANTE - Container já foi verificado acima
        const tarefaElement = document.createElement('div'); // CRIAÇÃO DUPLICADA - Elemento já foi criado
        tarefaElement.className = 'tarefa-item-prox'; // CLASSE ESPECÍFICA - Para tarefas da seção próximas
        tarefaElement.innerHTML = ` // ESTRUTURA IDÊNTICA - Mesmo formato de exibição
            <h4>${tarefa.titulo}</h4> // TÍTULO DA TAREFA
            <p>${tarefa.descricao}</p> // DESCRIÇÃO DA TAREFA
            <small>Prazo: ${tarefa.prazo} | Prioridade: ${tarefa.prioridade}</small> // INFORMAÇÕES ADICIONAIS
        `;
        container.appendChild(tarefaElement); // INSERÇÃO DUPLICADA
    }

    // BLOCO DUPLICADO PARA PROJETOS - Este código também nunca será executado
    if (container) { // VERIFICAÇÃO REDUNDANTE - Container já foi verificado
        const tarefaElement = document.createElement('div'); // CRIAÇÃO DUPLICADA - Elemento já foi criado
        tarefaElement.className = 'tarefa-item-projetos'; // CLASSE ESPECÍFICA - Para tarefas da seção projetos
        tarefaElement.innerHTML = ` // ESTRUTURA IDÊNTICA - Mesmo formato de exibição
            <h4>${tarefa.titulo}</h4> // TÍTULO DA TAREFA
            <p>${tarefa.descricao}</p> // DESCRIÇÃO DA TAREFA
            <small>Prazo: ${tarefa.prazo} | Prioridade: ${tarefa.prioridade}</small> // INFORMAÇÕES ADICIONAIS
        `;
        container.appendChild(tarefaElement); // INSERÇÃO DUPLICADA
    }
}

// FUNÇÃO DE PERSISTÊNCIA PARA SEÇÃO HOJE - Salva tarefas no armazenamento local do navegador para funcionalidades avançadas
function salvarTarefaHoje(tarefa) {
    let tarefasHoje = JSON.parse(localStorage.getItem('tarefasHoje')) || []; // RECUPERAÇÃO DE DADOS - Busca tarefas existentes ou cria array vazio
    tarefasHoje.push({ // ADIÇÃO DE NOVA TAREFA - Insere tarefa no final do array
        id: Date.now(), // GERAÇÃO DE ID ÚNICO - Usa timestamp atual como identificador
        titulo: tarefa.titulo, // CÓPIA DO TÍTULO - Mantém nome da tarefa
        descricao: tarefa.descricao, // CÓPIA DA DESCRIÇÃO - Mantém detalhes da tarefa
        prazo: tarefa.prazo, // CÓPIA DO PRAZO - Mantém data limite
        prioridade: tarefa.prioridade, // CÓPIA DA PRIORIDADE - Mantém nível de importância
        concluida: false // STATUS INICIAL - Define tarefa como não concluída
    });
    localStorage.setItem('tarefasHoje', JSON.stringify(tarefasHoje)); // SALVAMENTO PERMANENTE - Armazena dados atualizados no navegador
}

// SISTEMA DE NAVEGAÇÃO ENTRE PÁGINAS - Configura cliques nos cards para redirecionamento entre seções do site

// NAVEGAÇÃO PARA TAREFAS GERAIS - Configura redirecionamento para página principal de tarefas
const boxElement = document.querySelector('.box'); // SELEÇÃO DO CARD - Localiza elemento da seção de tarefas gerais
if (boxElement) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma que elemento está presente no DOM
    boxElement.addEventListener('click', function() { // LISTENER DE CLIQUE - Detecta interação do usuário
        window.location.href = 'tarefas.html'; // REDIRECIONAMENTO - Navega para página de tarefas gerais
    });
}

// NAVEGAÇÃO PARA HOJE - Configura redirecionamento para página de tarefas do dia atual
const hojeElement = document.querySelector('.Hoje'); // SELEÇÃO DO CARD - Localiza elemento da seção hoje
if (hojeElement) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma que elemento está presente no DOM
    hojeElement.addEventListener('click', function() { // LISTENER DE CLIQUE - Detecta interação do usuário
        window.location.href = 'hoje.html'; // REDIRECIONAMENTO - Navega para página de tarefas de hoje
    });
}

// NAVEGAÇÃO PARA PRÓXIMAS - Configura redirecionamento para página de tarefas futuras
const proxElement = document.querySelector('.prox'); // SELEÇÃO DO CARD - Localiza elemento da seção próximas
if (proxElement) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma que elemento está presente no DOM
    proxElement.addEventListener('click', function() { // LISTENER DE CLIQUE - Detecta interação do usuário
        window.location.href = 'prox.html'; // REDIRECIONAMENTO - Navega para página de tarefas futuras
    });
}

// NAVEGAÇÃO PARA PROJETOS - Configura redirecionamento para página de gerenciamento de projetos
const projetosElement = document.querySelector('.projetos'); // SELEÇÃO DO CARD - Localiza elemento da seção projetos
if (projetosElement) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma que elemento está presente no DOM
    projetosElement.addEventListener('click', function() { // LISTENER DE CLIQUE - Detecta interação do usuário
        window.location.href = 'projetos.html'; // REDIRECIONAMENTO - Navega para página de projetos
    });
}
