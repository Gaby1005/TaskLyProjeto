/**
 * @fileoverview Módulo de Gerenciamento de Detalhes de Projeto - TaskLy
 * 
 * Este arquivo contém a classe GerenciadorProjetoDetalhes, responsável por controlar
 * a página de detalhes de um projeto específico, incluindo visualização de informações,
 * gerenciamento de tarefas do projeto e interações com modais.
 * 
 * @author Daniel Augusto Suman De Carvalho, Gabrielle de Araujo Oliveira 
 * @version 1.0.0
 * @since 2025
 * 
 * PRINCIPAIS FUNCIONALIDADES:
 * 
 *   GERENCIAMENTO DE PROJETO:
 * - Carregamento e exibição de detalhes do projeto atual
 * - Recuperação de contexto via localStorage (projetoAtual)
 * - Validação de existência do projeto e tratamento de erros
 * - Navegação de retorno para lista de projetos em caso de erro
 * 
 *   GERENCIAMENTO DE TAREFAS:
 * - Criação de novas tarefas específicas do projeto
 * - Alternância de status (pendente ↔ concluída)
 * - Exclusão de tarefas com confirmação do usuário
 * - Renderização dinâmica da lista de tarefas
 * 
 *   CONTROLE DE INTERFACE:
 * - Gerenciamento de modal para criação de tarefas
 * - Event listeners para botões e formulários
 * - Fechamento de modal por clique externo ou botão
 * - Limpeza automática de formulários
 * 
 *   PERSISTÊNCIA DE DADOS:
 * - Sincronização com localStorage para projetos
 * - Atualização automática da lista principal de projetos
 * - Geração de IDs únicos baseados em timestamp
 * - Manutenção de integridade dos dados
 * 
 *  RENDERIZAÇÃO:
 * - Construção dinâmica de elementos HTML para tarefas
 * - Aplicação de classes CSS baseadas no status
 * - Formatação de datas para padrão brasileiro
 * - Mensagens informativas para estados vazios
 * 
 * ELEMENTOS DOM PRINCIPAIS:
 * - #modalNovaTarefaProjeto: Modal para criação de tarefas
 * - #novaTarefaProjetoBtn: Botão para abrir modal
 * - #cancelarTarefaProjetoBtn: Botão para cancelar criação
 * - #formNovaTarefaProjeto: Formulário de nova tarefa
 * - #lista-tarefas-projeto: Container da lista de tarefas
 * - #projeto-nome, #projeto-prazo, #projeto-descricao: Campos de detalhes
 * 
 * FLUXO DE FUNCIONAMENTO:
 * 1. Recupera ID do projeto atual do localStorage
 * 2. Carrega lista completa de projetos
 * 3. Localiza projeto específico pelo ID
 * 4. Valida existência e redireciona em caso de erro
 * 5. Inicializa interface com detalhes e tarefas
 * 6. Configura event listeners para interações
 * 7. Mantém sincronização com localStorage
 * 
 * @example
 * // O módulo é inicializado automaticamente quando o DOM carrega
 * // Estrutura típica de uso:
 * 
 * // 1. Usuário navega para projeto-detalhes.html
 * // 2. Sistema recupera 'projetoAtual' do localStorage
 * // 3. Classe é instanciada automaticamente
 * // 4. Interface é populada com dados do projeto
 * // 5. Usuário pode criar, editar e excluir tarefas
 * 
 * // Exemplo de estrutura de projeto:
 * const exemploProjeto = {
 *   id: "1640995200000",
 *   titulo: "Website Corporativo",
 *   prazo: "2025-02-15",
 *   descricao: "Desenvolvimento do site institucional",
 *   tarefas: [
 *     {
 *       id: "1640995201000",
 *       titulo: "Design da Homepage",
 *       descricao: "Criar layout responsivo",
 *       prazo: "2025-01-20",
 *       concluida: false,
 *       dataCriacao: "2025-01-01T10:00:00.000Z"
 *     }
 *   ]
 * };
 */

// SISTEMA DE GERENCIAMENTO DE DETALHES DE PROJETO - Classe responsável por controlar a página de detalhes de um projeto específico
class GerenciadorProjetoDetalhes {
    constructor() {
        // RECUPERAÇÃO DO CONTEXTO - Obtém identificador do projeto atual do armazenamento local
        this.projetoId = localStorage.getItem('projetoAtual'); // IDENTIFICAÇÃO - ID do projeto sendo visualizado
        
        // CARREGAMENTO DE DADOS - Busca todos os projetos salvos no navegador
        this.projetos = this.carregarProjetos(); // LISTA COMPLETA - Array com todos os projetos do usuário
        
        // LOCALIZAÇÃO DO PROJETO ESPECÍFICO - Encontra o projeto correspondente ao ID atual
        this.projeto = this.projetos.find(p => p.id === this.projetoId); // BUSCA ESPECÍFICA - Filtra projeto atual da lista
        
        // VALIDAÇÃO DE EXISTÊNCIA - Verifica se projeto foi encontrado e trata erro
        if (!this.projeto) { // TRATAMENTO DE ERRO - Projeto não existe ou foi removido
            alert('Projeto não encontrado!'); // NOTIFICAÇÃO DE ERRO - Informa usuário sobre problema
            window.location.href = 'projetos.html'; // REDIRECIONAMENTO - Volta para lista de projetos
            return; // INTERRUPÇÃO - Para execução do construtor
        }
        
        // INICIALIZAÇÃO DA INTERFACE - Configura elementos da página e carrega dados
        this.inicializar(); // CHAMADA DE CONFIGURAÇÃO - Inicia setup da página
    }

    // MÉTODO DE INICIALIZAÇÃO - Coordena setup completo da página de detalhes do projeto
    inicializar() {
        // CONFIGURAÇÃO DE INTERATIVIDADE - Estabelece listeners para botões e formulários
        this.configurarEventos(); // SETUP DE EVENTOS - Conecta ações do usuário às funções
        
        // EXIBIÇÃO DE INFORMAÇÕES - Popula campos com dados básicos do projeto
        this.carregarDetalhesProjeto(); // PREENCHIMENTO DE DADOS - Mostra título, prazo e descrição
        
        // RENDERIZAÇÃO DE TAREFAS - Constrói lista visual das tarefas do projeto
        this.renderizarTarefas(); // CONSTRUÇÃO DA LISTA - Cria elementos HTML para cada tarefa
    }

    // MÉTODO DE CONFIGURAÇÃO DE EVENTOS - Estabelece todos os listeners de interação da página
    configurarEventos() {
        // EVENTO DE ABERTURA DE MODAL - Configura botão para criar nova tarefa no projeto
        const novaTarefaBtn = document.getElementById('novaTarefaProjetoBtn'); // SELEÇÃO DO BOTÃO - Localiza botão de nova tarefa
        if (novaTarefaBtn) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma presença do elemento
            novaTarefaBtn.addEventListener('click', () => this.abrirModalNovaTarefa()); // LISTENER DE CLIQUE - Conecta ação de abertura
        }

        // EVENTO DE CANCELAMENTO - Configura botão para fechar modal sem salvar
        const cancelarBtn = document.getElementById('cancelarTarefaProjetoBtn'); // SELEÇÃO DO BOTÃO - Localiza botão de cancelar
        if (cancelarBtn) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma presença do elemento
            cancelarBtn.addEventListener('click', () => this.fecharModal()); // LISTENER DE CLIQUE - Conecta ação de fechamento
        }

        // EVENTO DE SUBMISSÃO - Configura formulário para processar criação de tarefa
        const formNovaTarefa = document.getElementById('formNovaTarefaProjeto'); // SELEÇÃO DO FORMULÁRIO - Localiza form de nova tarefa
        if (formNovaTarefa) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma presença do elemento
            formNovaTarefa.addEventListener('submit', (e) => this.salvarTarefa(e)); // LISTENER DE SUBMIT - Conecta processamento de dados
        }

        // EVENTO DE FECHAMENTO EXTERNO - Permite fechar modal clicando na área escura
        const modal = document.getElementById('modalNovaTarefaProjeto'); // SELEÇÃO DO MODAL - Localiza elemento popup
        if (modal) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma presença do elemento
            modal.addEventListener('click', (e) => { // LISTENER DE CLIQUE GLOBAL - Monitora cliques no modal
                if (e.target === modal) { // DETECÇÃO DE ÁREA EXTERNA - Verifica se clique foi fora do conteúdo
                    this.fecharModal(); // FECHAMENTO AUTOMÁTICO - Fecha modal por interação externa
                }
            });
        }
    }

    // MÉTODO DE CARREGAMENTO DE DETALHES - Popula interface com informações básicas do projeto
    carregarDetalhesProjeto() {
        // EXIBIÇÃO DE DADOS BÁSICOS - Preenche campos da interface com informações do projeto
        document.getElementById('projeto-nome').textContent = this.projeto.titulo; // TÍTULO - Exibe nome do projeto
        document.getElementById('projeto-prazo').textContent = new Date(this.projeto.prazo).toLocaleDateString('pt-BR'); // PRAZO FORMATADO - Converte data para formato brasileiro
        document.getElementById('projeto-descricao').textContent = this.projeto.descricao || 'Sem descrição'; // DESCRIÇÃO - Exibe detalhes ou mensagem padrão
    }

    // MÉTODO DE ABERTURA DE MODAL - Exibe interface para criação de nova tarefa
    abrirModalNovaTarefa() {
        // EXIBIÇÃO DO MODAL - Torna formulário de nova tarefa visível
        const modal = document.getElementById('modalNovaTarefaProjeto'); // SELEÇÃO DO MODAL - Localiza elemento popup
        if (modal) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma presença do elemento
            modal.style.display = 'block'; // ALTERAÇÃO DE VISIBILIDADE - Mostra modal na tela
        }
    }

    // MÉTODO DE FECHAMENTO DE MODAL - Oculta interface e limpa dados temporários
    fecharModal() {
        // OCULTAÇÃO E LIMPEZA - Esconde modal e remove dados não salvos
        const modal = document.getElementById('modalNovaTarefaProjeto'); // SELEÇÃO DO MODAL - Localiza elemento popup
        if (modal) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma presença do elemento
            modal.style.display = 'none'; // ALTERAÇÃO DE VISIBILIDADE - Esconde modal da tela
            this.limparFormulario(); // LIMPEZA DE DADOS - Remove valores inseridos no formulário
        }
    }

    // MÉTODO DE LIMPEZA DE FORMULÁRIO - Remove todos os valores inseridos pelo usuário
    limparFormulario() {
        // RESET DE CAMPOS - Restaura formulário ao estado inicial
        const form = document.getElementById('formNovaTarefaProjeto'); // SELEÇÃO DO FORMULÁRIO - Localiza form de nova tarefa
        if (form) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma presença do elemento
            form.reset(); // LIMPEZA AUTOMÁTICA - Remove todos os valores dos campos
        }
    }

    // MÉTODO DE SALVAMENTO DE TAREFA - Processa criação de nova tarefa no projeto
    salvarTarefa(e) {
        e.preventDefault(); // PREVENÇÃO DE RELOAD - Impede recarregamento padrão da página
        
        // COLETA DE DADOS DO FORMULÁRIO - Extrai valores inseridos pelo usuário
        const titulo = document.getElementById('tituloTarefaProjeto').value.trim(); // TÍTULO - Campo obrigatório da tarefa
        const descricao = document.getElementById('descricaoTarefaProjeto').value.trim(); // DESCRIÇÃO - Detalhes opcionais
        const prazo = document.getElementById('prazoTarefaProjeto').value; // PRAZO - Data limite opcional

        // VALIDAÇÃO DE DADOS - Verifica se campos obrigatórios foram preenchidos
        if (!titulo) { // VERIFICAÇÃO DE TÍTULO - Campo obrigatório
            alert('Por favor, preencha o título da tarefa.'); // NOTIFICAÇÃO DE ERRO - Informa sobre campo obrigatório
            return; // INTERRUPÇÃO - Para execução se dados inválidos
        }

        // CRIAÇÃO DO OBJETO TAREFA - Estrutura dados da nova tarefa
        const novaTarefa = {
            id: Date.now().toString(), // GERAÇÃO DE ID ÚNICO - Usa timestamp como identificador
            titulo, // TÍTULO DA TAREFA - Nome principal
            descricao, // DESCRIÇÃO DA TAREFA - Detalhes adicionais
            prazo, // PRAZO DA TAREFA - Data limite
            concluida: false, // STATUS INICIAL - Nova tarefa começa pendente
            dataCriacao: new Date().toISOString() // TIMESTAMP DE CRIAÇÃO - Registro de quando foi criada
        };

        // ADIÇÃO À LISTA DE TAREFAS - Insere nova tarefa no projeto atual
        this.projeto.tarefas.push(novaTarefa); // INSERÇÃO - Adiciona ao final da lista
        
        // ATUALIZAÇÃO DA LISTA DE PROJETOS - Sincroniza mudanças com lista principal
        const projetoIndex = this.projetos.findIndex(p => p.id === this.projetoId); // LOCALIZAÇÃO - Encontra posição do projeto
        if (projetoIndex !== -1) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma que projeto foi encontrado
            this.projetos[projetoIndex] = this.projeto; // SUBSTITUIÇÃO - Atualiza projeto na lista
        }
        
        // FINALIZAÇÃO DO PROCESSO - Salva dados e atualiza interface
        this.salvarProjetosLocalStorage(); // PERSISTÊNCIA - Salva no armazenamento local
        this.renderizarTarefas(); // ATUALIZAÇÃO VISUAL - Reconstrói lista de tarefas
        this.fecharModal(); // FECHAMENTO - Esconde modal após sucesso
    }

    // MÉTODO DE ALTERNÂNCIA DE STATUS - Altera estado de conclusão da tarefa
    toggleTarefa(tarefaId) {
        // LOCALIZAÇÃO DA TAREFA - Encontra tarefa específica pelo identificador
        const tarefa = this.projeto.tarefas.find(t => t.id === tarefaId); // BUSCA POR ID - Localiza tarefa na lista
        if (tarefa) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma que tarefa foi encontrada
            tarefa.concluida = !tarefa.concluida; // INVERSÃO DE STATUS - Alterna entre concluída/pendente
            
            // SINCRONIZAÇÃO COM LISTA PRINCIPAL - Atualiza projeto na lista geral
            const projetoIndex = this.projetos.findIndex(p => p.id === this.projetoId); // LOCALIZAÇÃO DO PROJETO - Encontra posição na lista
            if (projetoIndex !== -1) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma que projeto foi encontrado
                this.projetos[projetoIndex] = this.projeto; // SUBSTITUIÇÃO - Atualiza dados do projeto
            }
            
            // FINALIZAÇÃO DA ALTERAÇÃO - Persiste mudanças e atualiza interface
            this.salvarProjetosLocalStorage(); // PERSISTÊNCIA - Salva no armazenamento local
            this.renderizarTarefas(); // ATUALIZAÇÃO VISUAL - Reconstrói lista com novo status
        }
    }

    // MÉTODO DE EXCLUSÃO DE TAREFA - Remove tarefa permanentemente do projeto
    excluirTarefa(tarefaId) {
        // CONFIRMAÇÃO DO USUÁRIO - Solicita confirmação antes de excluir
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) { // DIÁLOGO DE CONFIRMAÇÃO - Previne exclusão acidental
            // REMOÇÃO DA LISTA - Filtra e remove tarefa específica
            this.projeto.tarefas = this.projeto.tarefas.filter(t => t.id !== tarefaId); // FILTRO DE EXCLUSÃO - Mantém apenas tarefas diferentes do ID
            
            // SINCRONIZAÇÃO COM LISTA PRINCIPAL - Atualiza projeto na lista geral
            const projetoIndex = this.projetos.findIndex(p => p.id === this.projetoId); // LOCALIZAÇÃO DO PROJETO - Encontra posição na lista
            if (projetoIndex !== -1) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma que projeto foi encontrado
                this.projetos[projetoIndex] = this.projeto; // SUBSTITUIÇÃO - Atualiza dados do projeto
            }
            
            // FINALIZAÇÃO DA EXCLUSÃO - Persiste mudanças e atualiza interface
            this.salvarProjetosLocalStorage(); // PERSISTÊNCIA - Salva no armazenamento local
            this.renderizarTarefas(); // ATUALIZAÇÃO VISUAL - Reconstrói lista sem a tarefa removida
        }
    }

    // MÉTODO DE RENDERIZAÇÃO DE TAREFAS - Constrói e exibe lista visual de tarefas do projeto
    renderizarTarefas() {
        // PREPARAÇÃO DA INTERFACE - Localiza container onde tarefas serão exibidas
        const listaTarefas = document.getElementById('lista-tarefas-projeto'); // SELEÇÃO DO CONTAINER - Elemento que conterá lista de tarefas
        if (!listaTarefas) return; // VERIFICAÇÃO DE EXISTÊNCIA - Para execução se elemento não existe

        // VERIFICAÇÃO DE LISTA VAZIA - Exibe mensagem quando não há tarefas no projeto
        if (this.projeto.tarefas.length === 0) { // TESTE DE QUANTIDADE - Verifica se lista está vazia
            listaTarefas.innerHTML = '<p class="sem-tarefas">Nenhuma tarefa criada ainda. Clique em "+ Adicionar Tarefa" para começar!</p>'; // MENSAGEM DE ESTADO VAZIO - Orienta usuário sobre próxima ação
            return; // INTERRUPÇÃO - Para execução pois não há tarefas para renderizar
        }

        // CONSTRUÇÃO DA LISTA VISUAL - Transforma dados das tarefas em elementos HTML
        listaTarefas.innerHTML = this.projeto.tarefas.map(tarefa => { // MAPEAMENTO DE DADOS - Converte cada tarefa em HTML
            const dataFormatada = tarefa.prazo ? new Date(tarefa.prazo).toLocaleDateString('pt-BR') : 'Sem prazo'; // FORMATAÇÃO DE DATA - Converte para padrão brasileiro ou exibe padrão
            const classeCompleta = tarefa.concluida ? 'tarefa-concluida' : ''; // CLASSE CONDICIONAL - Aplica estilo baseado no status
            
            // TEMPLATE HTML - Estrutura visual completa de cada tarefa
            return `
                <div class="tarefa-projeto-item ${classeCompleta}" data-id="${tarefa.id}">
                    <div class="tarefa-checkbox">
                        <input type="checkbox" 
                               id="tarefa-${tarefa.id}" 
                               ${tarefa.concluida ? 'checked' : ''}
                               onchange="gerenciadorDetalhes.toggleTarefa('${tarefa.id}')">
                    </div>
                    <div class="tarefa-conteudo">
                        <h4 class="tarefa-titulo ${tarefa.concluida ? 'titulo-concluido' : ''}">${tarefa.titulo}</h4>
                        ${tarefa.descricao ? `<p class="tarefa-descricao ${tarefa.concluida ? 'descricao-concluida' : ''}">${tarefa.descricao}</p>` : ''}
                        <small class="tarefa-prazo ${tarefa.concluida ? 'prazo-concluido' : ''}">Prazo: ${dataFormatada}</small>
                    </div>
                    <div class="tarefa-acoes">
                        <button class="btn-excluir-tarefa" onclick="gerenciadorDetalhes.excluirTarefa('${tarefa.id}')">×</button>
                    </div>
                </div>
            `; // RETORNO DO TEMPLATE - HTML estruturado com dados da tarefa
        }).join(''); // UNIÃO DE ELEMENTOS - Junta todos os HTMLs em uma única string
    }

    // MÉTODO DE CARREGAMENTO DE DADOS - Recupera projetos do armazenamento local
    carregarProjetos() {
        // RECUPERAÇÃO DE DADOS PERSISTIDOS - Obtém lista de projetos salvos anteriormente
        const projetos = localStorage.getItem('projetos'); // ACESSO AO STORAGE - Busca dados no armazenamento do navegador
        return projetos ? JSON.parse(projetos) : []; // CONVERSÃO E RETORNO - Transforma JSON em objeto ou retorna lista vazia
    }

    // MÉTODO DE PERSISTÊNCIA DE DADOS - Salva projetos no armazenamento local
    salvarProjetosLocalStorage() {
        // ARMAZENAMENTO PERMANENTE - Persiste lista atualizada de projetos
        localStorage.setItem('projetos', JSON.stringify(this.projetos)); // CONVERSÃO E SALVAMENTO - Transforma objeto em JSON e armazena
    }
}

// INICIALIZAÇÃO DA APLICAÇÃO - Cria instância do gerenciador quando página carrega
let gerenciadorDetalhes; // VARIÁVEL GLOBAL - Armazena instância do gerenciador para acesso global
document.addEventListener('DOMContentLoaded', () => { // EVENTO DE CARREGAMENTO - Aguarda DOM estar completamente carregado
    gerenciadorDetalhes = new GerenciadorProjetoDetalhes(); // CRIAÇÃO DE INSTÂNCIA - Inicializa sistema de gerenciamento de detalhes
});
