/**
 * @fileoverview Módulo de Gerenciamento de Tarefas da Próxima Semana
 * 
 * Este módulo é responsável pelo gerenciamento completo das tarefas programadas para a próxima semana,
 * incluindo criação, visualização, alteração de status e persistência de dados.
 * 
 * @author Gabrielle de Araujo Oliveira, Daniel Augusto Suman De Carvalho 
 * @version 1.0.0
 * @since 2025
 * 
 * @description Funcionalidades principais:
 * 
 * **CATEGORIAS DE FUNCIONALIDADES:**
 * 
 *  **GERENCIAMENTO DE DADOS**
 * - Carregamento de tarefas do localStorage
 * - Persistência automática de alterações
 * - Sincronização de dados entre sessões
 * - Estrutura de dados com ID único, título, descrição, prazo e status
 * 
 *   **INTERFACE E VISUALIZAÇÃO**
 * - Renderização dinâmica de listas de tarefas (pendentes/concluídas)
 * - Mensagens de estado para listas vazias
 * - Animações de transição entre estados
 * - Feedback visual para ações do usuário
 * 
 *  **INTERATIVIDADE**
 * - Sistema de checkbox para alteração de status
 * - Modal para criação de novas tarefas
 * - Eventos de formulário com validação
 * - Controles de abertura/fechamento de modal
 * 
 *  **MOVIMENTAÇÃO DE TAREFAS**
 * - Transição animada entre listas (pendentes ↔ concluídas)
 * - Atualização automática de status no localStorage
 * - Verificação e atualização de estados das seções
 * 
 *   **CRIAÇÃO DE TAREFAS**
 * - Formulário completo com título, descrição, prazo e prioridade
 * - Geração automática de IDs únicos
 * - Integração com sistema de armazenamento local
 * 
 * **ELEMENTOS DOM PRINCIPAIS:**
 * - #lista-tarefas-prox: Container de tarefas pendentes
 * - #lista-tarefas-concluidas-prox: Container de tarefas concluídas
 * - #modalNovaTarefaProx: Modal de criação de tarefas
 * - #formNovaTarefaProx: Formulário de nova tarefa
 * 
 */

// INICIALIZAÇÃO DA APLICAÇÃO - Aguarda carregamento completo do DOM antes de executar
document.addEventListener('DOMContentLoaded', function() { // EVENTO DE CARREGAMENTO - Garante que HTML esteja totalmente carregado

    // SELEÇÃO DE ELEMENTOS DOM - Localiza containers principais da interface
    const listaTarefasProx = document.getElementById('lista-tarefas-prox'); // CONTAINER DE PENDENTES - Lista de tarefas da próxima semana
    const listaTarefasConcluidas = document.getElementById('lista-tarefas-concluidas-prox'); // CONTAINER DE CONCLUÍDAS - Lista de tarefas finalizadas

    // CARREGAMENTO INICIAL - Executa função que recupera e exibe tarefas salvas
    carregarTarefas(); // INICIALIZAÇÃO DE DADOS - Carrega tarefas do localStorage
    
    // FUNÇÃO DE CARREGAMENTO DE DADOS - Recupera e exibe tarefas salvas no armazenamento
    function carregarTarefas() {
        // RECUPERAÇÃO DE DADOS PERSISTIDOS - Obtém tarefas do localStorage ou cria lista vazia
        const tarefasProx = JSON.parse(localStorage.getItem('tarefasProx')) || []; // ACESSO AO STORAGE - Busca dados salvos ou inicializa array vazio
        
        // LIMPEZA DA INTERFACE - Remove conteúdo anterior das listas
        listaTarefasProx.innerHTML = ''; // RESET DE PENDENTES - Limpa lista de tarefas pendentes
        listaTarefasConcluidas.innerHTML = ''; // RESET DE CONCLUÍDAS - Limpa lista de tarefas concluídas
        
        // VERIFICAÇÃO DE LISTA VAZIA - Exibe mensagens quando não há tarefas salvas
        if (tarefasProx.length === 0) { // TESTE DE QUANTIDADE - Verifica se não existem tarefas
            listaTarefasProx.innerHTML = '<div class="sem-tarefas">Nenhuma tarefa para a próxima semana. Crie uma nova tarefa!</div>'; // MENSAGEM DE ESTADO VAZIO - Orienta criação de nova tarefa
            listaTarefasConcluidas.innerHTML = '<div class="sem-tarefas">Nenhuma tarefa concluída ainda.</div>'; // MENSAGEM DE CONCLUÍDAS VAZIAS - Informa ausência de tarefas finalizadas
        } else {
            // SEPARAÇÃO POR STATUS - Divide tarefas entre pendentes e concluídas
            const tarefasPendentes = tarefasProx.filter(t => !t.concluida); // FILTRO DE PENDENTES - Seleciona tarefas não concluídas
            const tarefasConcluidas = tarefasProx.filter(t => t.concluida); // FILTRO DE CONCLUÍDAS - Seleciona tarefas finalizadas
            
            // VERIFICAÇÃO DE PENDENTES VAZIAS - Exibe mensagem quando todas estão concluídas
            if (tarefasPendentes.length === 0) { // TESTE DE PENDENTES - Verifica se não há tarefas pendentes
                listaTarefasProx.innerHTML = '<div class="sem-tarefas">Todas as tarefas foram concluídas! 🎉</div>'; // MENSAGEM DE SUCESSO - Parabeniza conclusão de todas as tarefas
            }
            
            // VERIFICAÇÃO DE CONCLUÍDAS VAZIAS - Exibe mensagem quando não há tarefas finalizadas
            if (tarefasConcluidas.length === 0) { // TESTE DE CONCLUÍDAS - Verifica se não há tarefas concluídas
                listaTarefasConcluidas.innerHTML = '<div class="sem-tarefas">Nenhuma tarefa concluída ainda.</div>'; // MENSAGEM DE ESTADO VAZIO - Informa ausência de conclusões
            }
            
            // RENDERIZAÇÃO VISUAL - Cria elementos HTML para cada tarefa
            tarefasProx.forEach(tarefa => { // ITERAÇÃO - Processa cada tarefa individualmente
                criarElementoTarefa(tarefa); // CRIAÇÃO DE ELEMENTO - Gera HTML da tarefa na interface
            });
        }
        
        // REATIVAÇÃO DE EVENTOS - Configura novamente os listeners dos checkboxes
        adicionarEventListeners(); // CONFIGURAÇÃO DE INTERATIVIDADE - Habilita controles de checkbox
    }
    
    // FUNÇÃO DE CRIAÇÃO DE ELEMENTO - Gera estrutura HTML visual para uma tarefa
    function criarElementoTarefa(tarefa) {
        // CRIAÇÃO DO CONTAINER - Cria elemento div que conterá toda a tarefa
        const tarefaElement = document.createElement('div'); // ELEMENTO BASE - Container principal da tarefa
        tarefaElement.className = `tarefa-item ${tarefa.concluida ? 'tarefa-concluida' : ''}`; // APLICAÇÃO DE CLASSES - Define aparência baseada no status
        tarefaElement.dataset.id = tarefa.id; // ARMAZENAMENTO DE ID - Salva identificador no atributo data
        
        // CONSTRUÇÃO DO HTML INTERNO - Monta estrutura visual completa da tarefa
        tarefaElement.innerHTML = `
            <input type="checkbox" id="tarefa${tarefa.id}" class="checkbox-tarefa" ${tarefa.concluida ? 'checked' : ''}>
            <div class="nome-tarefa">${tarefa.titulo}</div>
            <div class="data-tarefa">${tarefa.dataVencimento || tarefa.prazo || 'Sem data'}</div>
            ${tarefa.descricao ? `<div class="descricao-tarefa">${tarefa.descricao}</div>` : ''}
            <button class="btn-excluir" onclick="excluirTarefaProx('${tarefa.id}')">Excluir</button>
        `; // TEMPLATE HTML - Checkbox, título, data, descrição opcional e botão de exclusão
        
        // POSICIONAMENTO NA INTERFACE - Decide em qual lista inserir a tarefa
        if (tarefa.concluida) { // VERIFICAÇÃO DE STATUS - Testa se tarefa está concluída
            listaTarefasConcluidas.appendChild(tarefaElement); // INSERÇÃO EM CONCLUÍDAS - Adiciona à lista de finalizadas
        } else {
            listaTarefasProx.appendChild(tarefaElement); // INSERÇÃO EM PENDENTES - Adiciona à lista de próximas tarefas
        }
    }
    
    // FUNÇÃO DE CONFIGURAÇÃO DE EVENTOS - Adiciona interatividade aos checkboxes das tarefas
    function adicionarEventListeners() {
        // SELEÇÃO DE CHECKBOXES - Localiza todos os controles de marcação
        const checkboxes = document.querySelectorAll('.checkbox-tarefa'); // BUSCA DE ELEMENTOS - Encontra todos os checkboxes de tarefa
        
        // CONFIGURAÇÃO INDIVIDUAL - Adiciona evento a cada checkbox
        checkboxes.forEach(checkbox => { // ITERAÇÃO - Processa cada checkbox individualmente
            // EVENTO DE MUDANÇA - Detecta quando checkbox é marcado/desmarcado
            checkbox.addEventListener('change', function() { // LISTENER DE CHANGE - Responde a alterações no checkbox
                const tarefaElement = this.closest('.tarefa-item'); // LOCALIZAÇÃO DO CONTAINER - Encontra elemento pai da tarefa
                const tarefaId = tarefaElement.dataset.id; // EXTRAÇÃO DE ID - Obtém identificador da tarefa
                
                // DECISÃO DE MOVIMENTO - Determina para onde mover a tarefa baseado no estado
                if (this.checked) { // VERIFICAÇÃO DE MARCAÇÃO - Testa se checkbox foi marcado
                    moverParaConcluidas(tarefaId, tarefaElement); // MOVIMENTO PARA CONCLUÍDAS - Transfere para lista de finalizadas
                } else {
                    moverParaProx(tarefaId, tarefaElement); // MOVIMENTO PARA PENDENTES - Retorna para lista de próximas
                }
            });
        });
    }
    
    // FUNÇÃO DE MOVIMENTO PARA CONCLUÍDAS - Transfere tarefa para lista de finalizadas com animação
    function moverParaConcluidas(tarefaId, tarefaElement) {
        // MARCAÇÃO VISUAL - Aplica classe CSS para indicar conclusão
        tarefaElement.classList.add('tarefa-concluida'); // ADIÇÃO DE CLASSE - Marca visualmente como concluída
        
        // LIMPEZA DE MENSAGENS VAZIAS - Remove mensagem "sem tarefas" da lista de concluídas
        const semTarefasConcluidas = listaTarefasConcluidas.querySelector('.sem-tarefas'); // BUSCA DE MENSAGEM - Localiza mensagem de lista vazia
        if (semTarefasConcluidas) { // VERIFICAÇÃO DE EXISTÊNCIA - Testa se mensagem existe
            semTarefasConcluidas.remove(); // REMOÇÃO - Elimina mensagem pois lista não estará mais vazia
        }
        
        // ANIMAÇÃO DE SAÍDA - Aplica efeito visual de transição
        tarefaElement.style.transform = 'translateX(100%)'; // DESLOCAMENTO HORIZONTAL - Move elemento para direita
        tarefaElement.style.opacity = '0.5'; // REDUÇÃO DE OPACIDADE - Torna elemento semi-transparente
        
        // MOVIMENTO FÍSICO COM DELAY - Transfere elemento após animação
        setTimeout(() => { // TEMPORIZADOR - Aguarda 300ms para completar animação
            listaTarefasConcluidas.appendChild(tarefaElement); // TRANSFERÊNCIA - Move elemento para lista de concluídas
            tarefaElement.style.transform = 'translateX(0)'; // RESTAURAÇÃO DE POSIÇÃO - Retorna elemento à posição normal
            tarefaElement.style.opacity = '1'; // RESTAURAÇÃO DE OPACIDADE - Torna elemento totalmente visível
            verificarSecaoVazia(); // VERIFICAÇÃO DE ESTADO - Checa se listas precisam de mensagens vazias
        }, 300); // DURAÇÃO DA ANIMAÇÃO - 300 milissegundos
        
        // PERSISTÊNCIA DE DADOS - Salva mudança de status no armazenamento
        atualizarStatusTarefa(tarefaId, true); // ATUALIZAÇÃO NO STORAGE - Marca como concluída no localStorage
    }
    
    // FUNÇÃO DE MOVIMENTO PARA PENDENTES - Retorna tarefa para lista de próximas com animação
    function moverParaProx(tarefaId, tarefaElement) {
        // REMOÇÃO DE MARCAÇÃO VISUAL - Remove classe CSS de conclusão
        tarefaElement.classList.remove('tarefa-concluida'); // REMOÇÃO DE CLASSE - Desmarca visualmente como concluída
        
        // LIMPEZA DE MENSAGENS VAZIAS - Remove mensagem "sem tarefas" da lista de pendentes
        const semTarefasProx = listaTarefasProx.querySelector('.sem-tarefas'); // BUSCA DE MENSAGEM - Localiza mensagem de lista vazia
        if (semTarefasProx) { // VERIFICAÇÃO DE EXISTÊNCIA - Testa se mensagem existe
            semTarefasProx.remove(); // REMOÇÃO - Elimina mensagem pois lista não estará mais vazia
        }
        
        // ANIMAÇÃO DE SAÍDA - Aplica efeito visual de transição reversa
        tarefaElement.style.transform = 'translateX(-100%)'; // DESLOCAMENTO HORIZONTAL - Move elemento para esquerda
        tarefaElement.style.opacity = '0.5'; // REDUÇÃO DE OPACIDADE - Torna elemento semi-transparente
        
        // MOVIMENTO FÍSICO COM DELAY - Transfere elemento após animação
        setTimeout(() => { // TEMPORIZADOR - Aguarda 300ms para completar animação
            listaTarefasProx.appendChild(tarefaElement); // TRANSFERÊNCIA - Move elemento para lista de pendentes
            tarefaElement.style.transform = 'translateX(0)'; // RESTAURAÇÃO DE POSIÇÃO - Retorna elemento à posição normal
            tarefaElement.style.opacity = '1'; // RESTAURAÇÃO DE OPACIDADE - Torna elemento totalmente visível
            verificarSecaoVazia(); // VERIFICAÇÃO DE ESTADO - Checa se listas precisam de mensagens vazias
        }, 300); // DURAÇÃO DA ANIMAÇÃO - 300 milissegundos
        
        // PERSISTÊNCIA DE DADOS - Salva mudança de status no armazenamento
        atualizarStatusTarefa(tarefaId, false); // ATUALIZAÇÃO NO STORAGE - Marca como pendente no localStorage
    }
    
    // FUNÇÃO DE ATUALIZAÇÃO DE STATUS - Persiste mudança de estado da tarefa no armazenamento
    function atualizarStatusTarefa(tarefaId, concluida) {
        // RECUPERAÇÃO DE DADOS - Obtém lista atual de tarefas do localStorage
        let tarefasProx = JSON.parse(localStorage.getItem('tarefasProx')) || []; // ACESSO AO STORAGE - Busca dados salvos ou inicializa array vazio
        
        // LOCALIZAÇÃO DA TAREFA - Encontra posição da tarefa específica na lista
        const tarefaIndex = tarefasProx.findIndex(tarefa => tarefa.id === tarefaId); // BUSCA POR ID - Localiza índice da tarefa
        
        // ATUALIZAÇÃO E PERSISTÊNCIA - Modifica status e salva no armazenamento
        if (tarefaIndex !== -1) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma que tarefa foi encontrada
            tarefasProx[tarefaIndex].concluida = concluida; // ALTERAÇÃO DE STATUS - Atualiza propriedade concluida
            localStorage.setItem('tarefasProx', JSON.stringify(tarefasProx)); // SALVAMENTO - Persiste lista modificada no storage
        }
    }
    
    // FUNÇÃO DE VERIFICAÇÃO DE ESTADO - Checa se listas estão vazias e exibe mensagens apropriadas
    function verificarSecaoVazia() {
        // VERIFICAÇÃO DE LISTA DE PENDENTES - Analisa se há tarefas não concluídas
        const tarefasProx = listaTarefasProx.querySelectorAll('.tarefa-item:not(.tarefa-concluida)'); // SELEÇÃO DE PENDENTES - Busca tarefas sem classe de concluída
        
        // TRATAMENTO DE LISTA PENDENTES VAZIA - Exibe mensagem apropriada quando não há pendentes
        if (tarefasProx.length === 0 && !listaTarefasProx.querySelector('.sem-tarefas')) { // TESTE DE VAZIO - Verifica ausência de pendentes e mensagens
            const todasTarefas = document.querySelectorAll('.tarefa-item'); // CONTAGEM TOTAL - Verifica se existem tarefas em geral
            
            // DECISÃO DE MENSAGEM - Escolhe mensagem baseada na existência de tarefas
            if (todasTarefas.length > 0) { // EXISTEM TAREFAS - Há tarefas mas todas estão concluídas
                listaTarefasProx.innerHTML = '<div class="sem-tarefas">Todas as tarefas foram concluídas! 🎉</div>'; // MENSAGEM DE SUCESSO - Parabeniza conclusão total
            } else { // NÃO EXISTEM TAREFAS - Não há tarefas criadas
                listaTarefasProx.innerHTML = '<div class="sem-tarefas">Nenhuma tarefa para a próxima semana. Crie uma nova tarefa!</div>'; // MENSAGEM DE CRIAÇÃO - Orienta criação de tarefa
            }
        }
        
        // VERIFICAÇÃO DE LISTA DE CONCLUÍDAS - Analisa se há tarefas finalizadas
        const tarefasConcluidas = listaTarefasConcluidas.querySelectorAll('.tarefa-item.tarefa-concluida'); // SELEÇÃO DE CONCLUÍDAS - Busca tarefas com classe de concluída
        
        // TRATAMENTO DE LISTA CONCLUÍDAS VAZIA - Exibe mensagem quando não há concluídas
        if (tarefasConcluidas.length === 0 && !listaTarefasConcluidas.querySelector('.sem-tarefas')) { // TESTE DE VAZIO - Verifica ausência de concluídas e mensagens
            listaTarefasConcluidas.innerHTML = '<div class="sem-tarefas">Nenhuma tarefa concluída ainda.</div>'; // MENSAGEM DE ESTADO VAZIO - Informa ausência de conclusões
        }
    }
    
    // FUNÇÃO DE CRIAÇÃO DE TAREFA - Adiciona nova tarefa à lista de próximas tarefas
    function adicionarNovaTarefa(dadosTarefa) {
        // GERAÇÃO DE ID ÚNICO - Cria identificador único usando timestamp
        const novoId = 'tarefaProx' + Date.now(); // ID ÚNICO - Prefixo + timestamp para evitar duplicatas
        
        // CONSTRUÇÃO DO OBJETO TAREFA - Cria estrutura de dados da nova tarefa
        const novaTarefa = {
            id: novoId, // IDENTIFICADOR - ID único da tarefa
            titulo: dadosTarefa.titulo, // TÍTULO - Nome principal da tarefa
            descricao: dadosTarefa.descricao || '', // DESCRIÇÃO - Detalhes adicionais ou string vazia
            prazo: dadosTarefa.prazo, // PRAZO - Data limite para conclusão
            prioridade: dadosTarefa.prioridade, // NÍVEL DE PRIORIDADE - Importância da tarefa
            concluida: false, // STATUS INICIAL - Nova tarefa sempre começa como não concluída
            dataVencimento: dadosTarefa.prazo // DATA DE VENCIMENTO - Cópia do prazo para compatibilidade
        };
        
        // RECUPERAÇÃO E ATUALIZAÇÃO DE DADOS - Adiciona tarefa à lista existente
        let tarefasProx = JSON.parse(localStorage.getItem('tarefasProx')) || []; // CARREGAMENTO - Obtém lista atual ou inicializa vazia
        tarefasProx.push(novaTarefa); // ADIÇÃO - Insere nova tarefa na lista
        localStorage.setItem('tarefasProx', JSON.stringify(tarefasProx)); // PERSISTÊNCIA - Salva lista atualizada no storage
        
        // ATUALIZAÇÃO DA INTERFACE - Recarrega a visualização com nova tarefa
        carregarTarefas(); // REFRESH DA UI - Atualiza listas visuais
    }
    
    // Inicializa os eventos dos checkboxes
    adicionarEventListeners();
    
    // ------------------- Controle do modal de nova tarefa -------------------
    const fabButton = document.getElementById('fabNovaTarefaProx'); // Botão flutuante
    const novaTarefaBtn = document.getElementById('novaTarefaBtn'); // Botão dentro da interface
    const modal = document.getElementById('modalNovaTarefaProx'); // Modal de criação de tarefa
    const cancelarBtn = document.getElementById('cancelarBtnProx'); // Botão cancelar no modal
    const form = document.getElementById('formNovaTarefaProx'); // Formulário de nova tarefa
    
    // CONFIGURAÇÃO DE EVENT LISTENERS - Define interações do usuário com a interface
    
    // ABERTURA DE MODAL VIA FAB - Botão flutuante para criar nova tarefa
    if (fabButton) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma que elemento FAB existe
        fabButton.addEventListener('click', function() { // EVENTO DE CLIQUE - Detecta clique no botão FAB
            modal.style.display = 'block'; // EXIBIÇÃO DO MODAL - Torna modal visível
        });
    }
    
    // ABERTURA DE MODAL VIA BOTÃO DEDICADO - Botão "Nova Tarefa" alternativo
    if (novaTarefaBtn) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma que botão nova tarefa existe
        novaTarefaBtn.addEventListener('click', function() { // EVENTO DE CLIQUE - Detecta clique no botão nova tarefa
            modal.style.display = 'block'; // EXIBIÇÃO DO MODAL - Torna modal visível
        });
    }
    
    // CANCELAMENTO DE MODAL - Botão para fechar sem salvar
    if (cancelarBtn) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma que botão cancelar existe
        cancelarBtn.addEventListener('click', function() { // EVENTO DE CANCELAMENTO - Detecta clique em cancelar
            modal.style.display = 'none'; // OCULTAÇÃO DO MODAL - Esconde modal
            form.reset(); // LIMPEZA DO FORMULÁRIO - Reseta campos preenchidos
        });
    }
    
    // FECHAMENTO POR CLIQUE EXTERNO - Fecha modal ao clicar fora da área de conteúdo
    if (modal) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma que modal existe
        modal.addEventListener('click', function(e) { // EVENTO DE CLIQUE NO OVERLAY - Detecta clique na área do modal
            if (e.target === modal) { // VERIFICAÇÃO DE ALVO - Confirma que clique foi no overlay, não no conteúdo
                modal.style.display = 'none'; // OCULTAÇÃO DO MODAL - Esconde modal
                form.reset(); // LIMPEZA DO FORMULÁRIO - Reseta campos preenchidos
            }
        });
    }
    
    // SUBMISSÃO DE FORMULÁRIO - Processa criação de nova tarefa
    if (form) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma que formulário existe
        form.addEventListener('submit', function(e) { // EVENTO DE SUBMISSÃO - Detecta envio do formulário
            e.preventDefault(); // PREVENÇÃO DE RELOAD - Impede recarregamento da página
            
            // COLETA DE DADOS DO FORMULÁRIO - Extrai informações preenchidas pelo usuário
            const dadosTarefa = {
                titulo: document.getElementById('tituloProx').value, // TÍTULO - Obtém valor do campo título
                descricao: document.getElementById('descricaoProx').value, // DESCRIÇÃO - Obtém valor do campo descrição
                prazo: document.getElementById('prazoProx').value, // PRAZO - Obtém valor do campo data limite
                prioridade: document.getElementById('prioridadeProx').value // PRIORIDADE - Obtém valor do campo prioridade
            };
            
            // PROCESSAMENTO DA TAREFA - Chama função para criar e salvar tarefa
            adicionarNovaTarefa(dadosTarefa); // CRIAÇÃO - Executa adição da nova tarefa
            
            // FINALIZAÇÃO DO PROCESSO - Fecha modal e limpa formulário
            modal.style.display = 'none'; // OCULTAÇÃO - Esconde modal após criação
            form.reset(); // LIMPEZA - Reseta todos os campos do formulário
        });
    }
    
    // CONFIGURAÇÃO GLOBAL - Torna função acessível globalmente para outros scripts
    window.adicionarTarefaProx = adicionarNovaTarefa; // EXPOSIÇÃO GLOBAL - Permite acesso à função de outros arquivos JS
    
    // FUNÇÃO DE EXCLUSÃO DE TAREFAS - Remove tarefa permanentemente do sistema
    function excluirTarefaProx(tarefaId) {
        // CONFIRMAÇÃO DO USUÁRIO - Solicita confirmação antes de excluir
        if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
            return; // CANCELAMENTO - Para execução se usuário cancelar
        }
        
        // CARREGAMENTO DE DADOS - Recupera todas as tarefas do localStorage
        const tarefas = JSON.parse(localStorage.getItem('tarefas') || '[]');
        
        // FILTRAGEM DE DADOS - Remove a tarefa específica da lista
        const tarefasAtualizadas = tarefas.filter(tarefa => tarefa.id !== tarefaId);
        
        // PERSISTÊNCIA - Salva lista atualizada no localStorage
        localStorage.setItem('tarefas', JSON.stringify(tarefasAtualizadas));
        
        // ATUALIZAÇÃO DA INTERFACE - Recarrega a lista de tarefas na tela
        carregarTarefas();
    }
    
    // Expondo função de exclusão globalmente
    window.excluirTarefaProx = excluirTarefaProx;
    
    // SINCRONIZAÇÃO DE DADOS - Recarrega tarefas quando usuário retorna à aba
    window.addEventListener('focus', function() { // EVENTO DE FOCO - Detecta quando janela ganha foco
        carregarTarefas(); // ATUALIZAÇÃO - Recarrega lista para sincronizar possíveis mudanças
    });
});

// ------------------- INJEÇÃO DE ESTILOS CSS -------------------
// CRIAÇÃO DINÂMICA DE ANIMAÇÃO - Adiciona efeitos visuais via JavaScript
const style = document.createElement('style'); // CRIAÇÃO DE ELEMENTO - Cria tag style
style.textContent = `
    @keyframes slideInProx {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`; // DEFINIÇÃO DE ANIMAÇÃO - CSS para efeito de deslizamento vertical
document.head.appendChild(style); // INSERÇÃO NO DOM - Adiciona estilos ao cabeçalho da página
