/**
 * @fileoverview Gerenciador de Tarefas para a Página "Hoje" - TaskLy
 * 
 * Este arquivo contém toda a lógica para gerenciar tarefas na página "Hoje" do sistema TaskLy.
 * Inclui funcionalidades para carregar, exibir, criar, mover e persistir tarefas entre
 * as listas de pendentes e concluídas, com animações suaves e sincronização automática.
 * 
 * Principais funcionalidades:
 * - Carregamento de tarefas do localStorage
 * - Renderização dinâmica de elementos de tarefa
 * - Movimentação entre listas com animações
 * - Persistência de dados no navegador
 * - Verificação de estados vazios
 * - Sincronização automática ao retornar à aba
 * 
 * @author Gabrielle de Araujo Oliveira, Daniel Augusto Suman De Carvalho 
 * @version 1.0.0
 * @since 2025
 */

/**
 * @fileoverview Módulo de Gerenciamento de Tarefas Diárias - TaskLy
 * 
 * Este arquivo contém toda a lógica para gerenciar tarefas do dia atual na aplicação TaskLy.
 * Responsável por carregar, exibir, criar e manipular tarefas diárias com persistência no localStorage.
 * 
 * @author Gabrielle de Araujo Oliveira, Daniel Augusto Suman De Carvalho 
 * @version 1.0.0
 * @since 2025
 * 
 * PRINCIPAIS FUNCIONALIDADES:
 * 
 *   CARREGAMENTO E RENDERIZAÇÃO:
 * - Carregamento automático de tarefas do localStorage
 * - Renderização dinâmica de elementos HTML para cada tarefa
 * - Separação visual entre tarefas pendentes e concluídas
 * - Exibição de mensagens informativas para listas vazias
 * 
 *   INTERATIVIDADE E EVENTOS:
 * - Event listeners para checkboxes de conclusão de tarefas
 * - Movimentação animada entre listas (pendentes ↔ concluídas)
 * - Configuração de botão flutuante para criação de novas tarefas
 * - Sincronização automática quando a janela ganha foco
 * 
 *   PERSISTÊNCIA DE DADOS:
 * - Armazenamento no localStorage do navegador
 * - Atualização automática do status de conclusão
 * - Manutenção de dados entre sessões do usuário
 * 
 *   ANIMAÇÕES E UX:
 * - Transições suaves para movimentação de tarefas
 * - Animações CSS dinâmicas (slideIn)
 * - Feedback visual para ações do usuário
 * 
 * @example
 * // O módulo é inicializado automaticamente quando o DOM carrega
 * // Funções principais disponíveis globalmente:
 * window.adicionarTarefaHoje('Nova Tarefa', '2024-01-15');
 */

// EVENTO QUE AGUARDA O HTML CARREGAR COMPLETAMENTE - Garante que todos os elementos da página estejam disponíveis antes de executar o JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // SELEÇÃO DE ELEMENTOS DOM - Busca e armazena referências aos elementos HTML que serão manipulados pelo JavaScript
    const listaTarefasHoje = document.getElementById('lista-tarefas-hoje'); // ELEMENTO HTML onde serão exibidas as tarefas pendentes do dia atual
    const listaTarefasConcluidas = document.getElementById('lista-tarefas-concluidas'); // ELEMENTO HTML onde serão exibidas as tarefas já finalizadas
    
    // CHAMADA INICIAL DA FUNÇÃO - Executa imediatamente ao carregar a página para mostrar tarefas já salvas
    carregarTarefas();
    
    function carregarTarefas() {
        const tarefasHoje = JSON.parse(localStorage.getItem('tarefasHoje')) || []; // RECUPERAÇÃO DE DADOS - Busca tarefas salvas no navegador ou cria array vazio se não houver dados
        
        // LIMPEZA DA INTERFACE - Remove todo conteúdo HTML das listas para evitar duplicação ao recarregar
        listaTarefasHoje.innerHTML = ''; // LIMPA lista de tarefas pendentes
        listaTarefasConcluidas.innerHTML = ''; // LIMPA lista de tarefas concluídas
        
        if (tarefasHoje.length === 0) {
            // VERIFICAÇÃO DE DADOS VAZIOS - Testa se não existem tarefas salvas e exibe mensagens informativas ao usuário
            listaTarefasHoje.innerHTML = '<div class="sem-tarefas">Nenhuma tarefa para hoje. Crie uma nova tarefa!</div>'; // MENSAGEM MOTIVACIONAL para criar primeira tarefa
            listaTarefasConcluidas.innerHTML = '<div class="sem-tarefas">Nenhuma tarefa concluída ainda.</div>'; // MENSAGEM INFORMATIVA sobre seção vazia
        } else {
            // SEPARAÇÃO DE DADOS - Filtra e organiza tarefas em duas categorias baseado no status de conclusão
            const tarefasPendentes = tarefasHoje.filter(t => !t.concluida); // FILTRO que seleciona apenas tarefas não concluídas
            const tarefasConcluidas = tarefasHoje.filter(t => t.concluida); // FILTRO que seleciona apenas tarefas concluídas
            
            // VERIFICAÇÃO DE SEÇÕES VAZIAS - Testa cada categoria e exibe mensagens apropriadas quando não há itens
            if (tarefasPendentes.length === 0) {
                listaTarefasHoje.innerHTML = '<div class="sem-tarefas">Todas as tarefas foram concluídas! 🎉</div>'; // MENSAGEM DE PARABÉNS quando todas tarefas estão finalizadas
            }
            
            // VERIFICAÇÃO DE TAREFAS CONCLUÍDAS - Mostra mensagem quando ainda não há tarefas finalizadas
            if (tarefasConcluidas.length === 0) {
                listaTarefasConcluidas.innerHTML = '<div class="sem-tarefas">Nenhuma tarefa concluída ainda.</div>'; // MENSAGEM INFORMATIVA sobre progresso
            }
            
            // RENDERIZAÇÃO DE ELEMENTOS - Loop que cria e exibe cada tarefa na interface do usuário
            tarefasHoje.forEach(tarefa => {
                criarElementoTarefa(tarefa); // CHAMADA DE FUNÇÃO que converte dados em elementos HTML visíveis
            });
        }
        
        // REATIVAÇÃO DE EVENTOS - Reconecta funcionalidades de clique após recriar elementos HTML
        adicionarEventListeners(); // FUNÇÃO que torna os checkboxes e botões funcionais novamente
    }
    
    function criarElementoTarefa(tarefa) {
        const tarefaElement = document.createElement('div'); // CRIAÇÃO DE ELEMENTO - Gera novo container HTML para a tarefa
        tarefaElement.className = `tarefa-item ${tarefa.concluida ? 'tarefa-concluida' : ''}`; // APLICAÇÃO DE CLASSES CSS - Define aparência baseada no status da tarefa
        tarefaElement.dataset.id = tarefa.id; // ARMAZENAMENTO DE IDENTIFICADOR - Guarda ID único para manipulação posterior
        tarefaElement.innerHTML = `
            <input type="checkbox" id="tarefa${tarefa.id}" class="checkbox-tarefa" ${tarefa.concluida ? 'checked' : ''}>
            <div class="nome-tarefa">${tarefa.titulo}</div>
            <div class="data-tarefa">${tarefa.dataVencimento || tarefa.prazo || 'Sem data'}</div>
            ${tarefa.descricao ? `<div class="descricao-tarefa">${tarefa.descricao}</div>` : ''}
            <button class="btn-excluir" onclick="excluirTarefaHoje('${tarefa.id}')">Excluir</button>
        `; // CONSTRUÇÃO DE HTML - Cria estrutura interna com checkbox, título, data, descrição opcional e botão de exclusão
        
        // POSICIONAMENTO CONDICIONAL - Decide onde inserir o elemento baseado no status de conclusão
        if (tarefa.concluida) {
            listaTarefasConcluidas.appendChild(tarefaElement); // INSERÇÃO na lista de tarefas finalizadas
        } else {
            listaTarefasHoje.appendChild(tarefaElement); // INSERÇÃO na lista de tarefas pendentes
        }
    }
    
    function adicionarEventListeners() {
        const checkboxes = document.querySelectorAll('.checkbox-tarefa'); // SELEÇÃO DE CHECKBOXES - Busca todos os elementos de marcação na página
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() { // EVENTO DE MUDANÇA - Detecta quando usuário marca/desmarca checkbox
                const tarefaElement = this.closest('.tarefa-item'); // NAVEGAÇÃO DOM - Encontra o container pai da tarefa
                const tarefaId = tarefaElement.dataset.id; // EXTRAÇÃO DE DADOS - Recupera identificador único da tarefa
                if (this.checked) {
                    moverParaConcluidas(tarefaId, tarefaElement); // AÇÃO DE CONCLUSÃO - Executa quando tarefa é marcada como feita
                } else {
                    moverParaHoje(tarefaId, tarefaElement); // AÇÃO DE REVERSÃO - Executa quando tarefa é desmarcada
                }
            });
        });
    }
    
    function moverParaConcluidas(tarefaId, tarefaElement) {
        tarefaElement.classList.add('tarefa-concluida'); // MARCAÇÃO VISUAL - Adiciona classe CSS que aplica estilo de tarefa finalizada
        
        // LIMPEZA DE MENSAGENS - Remove avisos de seção vazia quando primeira tarefa é adicionada
        const semTarefasConcluidas = listaTarefasConcluidas.querySelector('.sem-tarefas');
        if (semTarefasConcluidas) semTarefasConcluidas.remove(); // REMOÇÃO CONDICIONAL de mensagem informativa
        
        // ANIMAÇÃO DE SAÍDA - Aplica efeitos visuais antes de mover elemento
        tarefaElement.style.transform = 'translateX(100%)'; // DESLIZAMENTO para direita
        tarefaElement.style.opacity = '0.5'; // TRANSPARÊNCIA parcial
        
        setTimeout(() => {
            // MOVIMENTAÇÃO FÍSICA - Transfere elemento entre listas após animação
            listaTarefasConcluidas.appendChild(tarefaElement); // INSERÇÃO na nova lista
            tarefaElement.style.transform = 'translateX(0)'; // RESTAURAÇÃO da posição
            tarefaElement.style.opacity = '1'; // RESTAURAÇÃO da opacidade
            
            // VERIFICAÇÃO DE ESTADO - Testa se listas ficaram vazias após movimentação
            verificarSecaoVazia();
        }, 300); // DELAY de 300ms para suavizar transição
        
        // PERSISTÊNCIA DE DADOS - Salva mudança de status no armazenamento do navegador
        atualizarStatusTarefa(tarefaId, true); // ATUALIZAÇÃO com status concluído
    }
    
    function moverParaHoje(tarefaId, tarefaElement) {
        tarefaElement.classList.remove('tarefa-concluida'); // REMOÇÃO VISUAL - Remove classe CSS de tarefa finalizada
        
        // LIMPEZA DE MENSAGENS - Remove avisos de seção vazia quando primeira tarefa é adicionada
        const semTarefasHoje = listaTarefasHoje.querySelector('.sem-tarefas');
        if (semTarefasHoje) semTarefasHoje.remove(); // REMOÇÃO CONDICIONAL de mensagem informativa
        
        // ANIMAÇÃO DE SAÍDA - Aplica efeitos visuais antes de mover elemento
        tarefaElement.style.transform = 'translateX(-100%)'; // DESLIZAMENTO para esquerda
        tarefaElement.style.opacity = '0.5'; // TRANSPARÊNCIA parcial
        
        setTimeout(() => {
            // MOVIMENTAÇÃO FÍSICA - Transfere elemento entre listas após animação
            listaTarefasHoje.appendChild(tarefaElement); // INSERÇÃO na lista de pendentes
            tarefaElement.style.transform = 'translateX(0)'; // RESTAURAÇÃO da posição
            tarefaElement.style.opacity = '1'; // RESTAURAÇÃO da opacidade
            
            // VERIFICAÇÃO DE ESTADO - Testa se listas ficaram vazias após movimentação
            verificarSecaoVazia();
        }, 300); // DELAY de 300ms para suavizar transição
        
        // PERSISTÊNCIA DE DADOS - Salva mudança de status no armazenamento do navegador
        atualizarStatusTarefa(tarefaId, false); // ATUALIZAÇÃO com status pendente
    }
    
    function atualizarStatusTarefa(tarefaId, concluida) {
        let tarefasHoje = JSON.parse(localStorage.getItem('tarefasHoje')) || []; // RECUPERAÇÃO DE DADOS - Busca lista atual de tarefas
        const tarefaIndex = tarefasHoje.findIndex(tarefa => tarefa.id === tarefaId); // LOCALIZAÇÃO - Encontra posição da tarefa específica no array
        
        if (tarefaIndex !== -1) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma que tarefa foi encontrada
            tarefasHoje[tarefaIndex].concluida = concluida; // ATUALIZAÇÃO DE PROPRIEDADE - Modifica status de conclusão
            localStorage.setItem('tarefasHoje', JSON.stringify(tarefasHoje)); // SALVAMENTO PERMANENTE - Armazena dados atualizados no navegador
        }
    }
    
    function verificarSecaoVazia() {
        // VERIFICAÇÃO DA LISTA DE PENDENTES - Testa se seção de tarefas do dia está vazia
        const tarefasHoje = listaTarefasHoje.querySelectorAll('.tarefa-item:not(.tarefa-concluida)'); // SELEÇÃO de tarefas não concluídas
        if (tarefasHoje.length === 0 && !listaTarefasHoje.querySelector('.sem-tarefas')) { // TESTE DUPLO - verifica vazio e ausência de mensagem
            const todasTarefas = document.querySelectorAll('.tarefa-item'); // CONTAGEM TOTAL de tarefas existentes
            if (todasTarefas.length > 0) {
                listaTarefasHoje.innerHTML = '<div class="sem-tarefas">Todas as tarefas foram concluídas! 🎉</div>'; // MENSAGEM DE SUCESSO quando todas estão finalizadas
            } else {
                listaTarefasHoje.innerHTML = '<div class="sem-tarefas">Nenhuma tarefa para hoje. Crie uma nova tarefa!</div>'; // MENSAGEM MOTIVACIONAL quando não há tarefas
            }
        }
        
        // VERIFICAÇÃO DA LISTA DE CONCLUÍDAS - Testa se seção de tarefas finalizadas está vazia
        const tarefasConcluidas = listaTarefasConcluidas.querySelectorAll('.tarefa-item.tarefa-concluida'); // SELEÇÃO de tarefas concluídas
        if (tarefasConcluidas.length === 0 && !listaTarefasConcluidas.querySelector('.sem-tarefas')) { // TESTE DUPLO - verifica vazio e ausência de mensagem
            listaTarefasConcluidas.innerHTML = '<div class="sem-tarefas">Nenhuma tarefa concluída ainda.</div>'; // MENSAGEM INFORMATIVA sobre progresso
        }
    }
    
    function adicionarNovaTarefa(titulo, dataVencimento) {
        const novoId = 'tarefa' + Date.now(); // Cria ID único
        const novaTarefaHTML = `
            <div class="tarefa-checkbox">
                <input type="checkbox" id="${novoId}" class="checkbox-tarefa">
                <label for="${novoId}" class="label-tarefa">
                    <span class="nome-tarefa">${titulo}</span>
                    <span class="data-conclusao">${dataVencimento}</span>
                </label>
            </div>
        `;
        
        // Adiciona na lista de hoje
        listaTarefasHoje.insertAdjacentHTML('beforeend', novaTarefaHTML);
        
        // Reaplica eventos
        adicionarEventListeners();
    }
    
    // Inicializa eventos para os checkboxes já carregados
    adicionarEventListeners();
    
    // CONFIGURAÇÃO DO BOTÃO FLUTUANTE - Configura ação do botão de adicionar nova tarefa
    const fabButton = document.getElementById('fabNovaTarefa'); // SELEÇÃO do botão flutuante (Floating Action Button)
    const modal = document.getElementById('modalNovaTarefa'); // LOCALIZAÇÃO do modal de criação
    
    if (fabButton && modal) { // VERIFICAÇÃO DE EXISTÊNCIA - Confirma que elementos existem na página
        fabButton.addEventListener('click', function() { // EVENTO DE CLIQUE - Define ação ao clicar no botão
            modal.style.display = 'block'; // EXIBIÇÃO VISUAL - Torna modal visível na tela
        });
    }
    
    // Expondo a função globalmente (para usar fora desse script)
    window.adicionarTarefaHoje = adicionarNovaTarefa;
    
    // SINCRONIZAÇÃO AUTOMÁTICA - Recarrega dados quando usuário retorna à aba do navegador
    window.addEventListener('focus', function() { // EVENTO DE FOCO - Detecta quando janela volta a ter foco
        carregarTarefas(); // ATUALIZAÇÃO DE DADOS - Recarrega tarefas do localStorage para sincronizar mudanças
    });
});

// FUNÇÃO DE EXCLUSÃO DE TAREFAS - Remove tarefa permanentemente do sistema
function excluirTarefaHoje(tarefaId) {
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
    
    // RECARREGAMENTO DA PÁGINA - Força atualização completa da interface
    location.reload();
}

// Expondo função de exclusão globalmente
window.excluirTarefaHoje = excluirTarefaHoje;

// CRIAÇÃO DINÂMICA DE ANIMAÇÃO CSS - Adiciona definição de animação slideIn ao documento
const style = document.createElement('style'); // CRIAÇÃO de elemento <style> via JavaScript
style.textContent = `
    @keyframes slideIn { // DEFINIÇÃO DE ANIMAÇÃO - Cria efeito de deslizamento suave
        from { // ESTADO INICIAL da animação
            opacity: 0; // TRANSPARÊNCIA - Elemento começa invisível
            transform: translateY(-10px); // POSICIONAMENTO - Elemento começa 10px acima
        }
        to { // ESTADO FINAL da animação
            opacity: 1; // TRANSPARÊNCIA - Elemento termina completamente visível
            transform: translateY(0); // POSICIONAMENTO - Elemento termina na posição normal
        }
    }
`;
document.head.appendChild(style); // INSERÇÃO NO DOM - Adiciona estilos CSS ao cabeçalho do documento
