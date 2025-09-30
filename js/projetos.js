/**
 * @fileoverview Módulo de Gerenciamento de Projetos
 * 
 * Este módulo é responsável pelo gerenciamento completo dos projetos no sistema TaskLy,
 * incluindo criação, visualização, edição, exclusão e navegação para detalhes dos projetos.
 * 
 * @author Gabrielle de Araujo Oliveira, Daniel Augusto Suman De Carvalho 
 * @version 1.0.0
 * @since 2025
 * 
 * @description Funcionalidades principais:
 * 
 * **CATEGORIAS DE FUNCIONALIDADES:**
 * 
 *   **GERENCIAMENTO DE DADOS**
 * - Carregamento de projetos do localStorage
 * - Persistência automática de alterações
 * - Sincronização de dados entre sessões
 * - Estrutura de dados com ID único, título, descrição e prazo
 * 
 *   **INTERFACE E VISUALIZAÇÃO**
 * - Renderização dinâmica de cards de projetos
 * - Mensagens de estado para lista vazia
 * - Layout responsivo em grid
 * - Feedback visual para ações do usuário
 * 
 *   **INTERATIVIDADE**
 * - Modal para criação de novos projetos
 * - Formulário com validação
 * - Navegação para página de detalhes
 * - Controles de abertura/fechamento de modal
 * 
 *   **CRIAÇÃO DE PROJETOS**
 * - Formulário completo com título, descrição e prazo
 * - Geração automática de IDs únicos
 * - Validação de campos obrigatórios
 * - Integração com sistema de armazenamento local
 * 
 * 
 * **ELEMENTOS DOM PRINCIPAIS:**
 * - #lista-projetos: Container de projetos
 * - #modalNovoProjeto: Modal de criação de projetos
 * - #formNovoProjeto: Formulário de novo projeto
 * - #novoProjetoBtn: Botão para abrir modal
 * 
 */

// INICIALIZAÇÃO DA APLICAÇÃO - Aguarda carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // SELEÇÃO DE ELEMENTOS DOM - Localiza elementos principais da interface
    const listaProjetos = document.getElementById('lista-projetos');
    const modal = document.getElementById('modalNovoProjeto');
    const novoProjetoBtn = document.getElementById('novoProjetoBtn');
    const cancelarBtn = document.getElementById('cancelarProjetoBtn');
    const form = document.getElementById('formNovoProjeto');
    
    // CARREGAMENTO INICIAL - Executa função que recupera e exibe projetos salvos
    carregarProjetos();
    
    // FUNÇÃO DE CARREGAMENTO DE DADOS - Recupera e exibe projetos salvos no armazenamento
    function carregarProjetos() {
        // RECUPERAÇÃO DE DADOS PERSISTIDOS - Obtém projetos do localStorage ou cria lista vazia
        const projetos = JSON.parse(localStorage.getItem('projetos')) || [];
        
        // LIMPEZA DA INTERFACE - Remove conteúdo anterior da lista
        listaProjetos.innerHTML = '';
        
        // VERIFICAÇÃO DE LISTA VAZIA - Exibe mensagem quando não há projetos salvos
        if (projetos.length === 0) {
            listaProjetos.innerHTML = `
                <div class="sem-projetos">
                    <p>Nenhum projeto encontrado.</p>
                    <p>Clique em "Novo Projeto" para começar!</p>
                </div>
            `;
        } else {
            // RENDERIZAÇÃO VISUAL - Cria cards para cada projeto
            projetos.forEach(projeto => {
                criarCardProjeto(projeto);
            });
        }
    }
    
    // FUNÇÃO DE CRIAÇÃO DE CARD - Gera estrutura HTML visual para um projeto
    function criarCardProjeto(projeto) {
        // CRIAÇÃO DO CONTAINER - Cria elemento div que conterá todo o card
        const projetoCard = document.createElement('div');
        projetoCard.className = 'projeto-box';
        projetoCard.dataset.id = projeto.id;
        
        // FORMATAÇÃO DE DATA - Converte data para formato brasileiro
        const dataFormatada = projeto.prazo ? new Date(projeto.prazo + 'T00:00:00').toLocaleDateString('pt-BR') : 'Sem prazo';
        
        // CONSTRUÇÃO DO HTML INTERNO - Monta estrutura visual completa do card
        projetoCard.innerHTML = `
            <div class="projeto-header">
                <h3 class="projeto-titulo">${projeto.titulo}</h3>
                <div class="projeto-acoes">
                    <button class="btn-abrir" onclick="verDetalhes('${projeto.id}')">Abrir</button>
                    <button class="btn-excluir" onclick="excluirProjeto('${projeto.id}')">Excluir</button>
                </div>
            </div>
            <div class="projeto-info">
                <div class="projeto-prazo">Prazo: ${dataFormatada}</div>
                <div class="projeto-descricao">
                    ${projeto.descricao || 'Sem descrição'}
                </div>
            </div>
            <div class="projeto-footer">
                <div class="projeto-tarefas">
                    ${projeto.tarefas ? projeto.tarefas.length : 0} tarefas • ${projeto.tarefas ? projeto.tarefas.filter(t => t.concluida).length : 0} concluídas
                </div>
            </div>
        `;
        
        // INSERÇÃO NA INTERFACE - Adiciona card à lista de projetos
        listaProjetos.appendChild(projetoCard);
    }
    
    // FUNÇÃO DE CRIAÇÃO DE PROJETO - Adiciona novo projeto à lista
    function adicionarNovoProjeto(dadosProjeto) {
        // GERAÇÃO DE ID ÚNICO - Cria identificador único usando timestamp
        const novoId = 'projeto' + Date.now();
        
        // CONSTRUÇÃO DO OBJETO PROJETO - Cria estrutura de dados do novo projeto
        const novoProjeto = {
            id: novoId,
            titulo: dadosProjeto.titulo,
            descricao: dadosProjeto.descricao || '',
            prazo: dadosProjeto.prazo,
            dataCriacao: new Date().toISOString().split('T')[0],
            tarefas: []
        };
        
        // RECUPERAÇÃO E ATUALIZAÇÃO DE DADOS - Adiciona projeto à lista existente
        let projetos = JSON.parse(localStorage.getItem('projetos')) || [];
        projetos.push(novoProjeto);
        localStorage.setItem('projetos', JSON.stringify(projetos));
        
        // ATUALIZAÇÃO DA INTERFACE - Recarrega a visualização com novo projeto
        carregarProjetos();
    }
    
    // CONFIGURAÇÃO DE EVENT LISTENERS - Define interações do usuário com a interface
    
    // ABERTURA DE MODAL - Botão para criar novo projeto
    if (novoProjetoBtn) {
        novoProjetoBtn.addEventListener('click', function() {
            modal.style.display = 'block';
        });
    }
    
    // CANCELAMENTO DE MODAL - Botão para fechar sem salvar
    if (cancelarBtn) {
        cancelarBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            form.reset();
        });
    }
    
    // FECHAMENTO POR CLIQUE EXTERNO - Fecha modal ao clicar fora da área de conteúdo
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                form.reset();
            }
        });
    }
    
    // SUBMISSÃO DE FORMULÁRIO - Processa criação de novo projeto
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // COLETA DE DADOS DO FORMULÁRIO - Extrai informações preenchidas pelo usuário
            const dadosProjeto = {
                titulo: document.getElementById('tituloProjeto').value,
                descricao: document.getElementById('descricaoProjeto').value,
                prazo: document.getElementById('prazoProjeto').value
            };
            
            // PROCESSAMENTO DO PROJETO - Chama função para criar e salvar projeto
            adicionarNovoProjeto(dadosProjeto);
            
            // FINALIZAÇÃO DO PROCESSO - Fecha modal e limpa formulário
            modal.style.display = 'none';
            form.reset();
        });
    }
    
    // SINCRONIZAÇÃO DE DADOS - Recarrega projetos quando usuário retorna à aba
    window.addEventListener('focus', function() {
        carregarProjetos();
    });
});

// FUNÇÃO DE NAVEGAÇÃO - Redireciona para página de detalhes do projeto
    function verDetalhes(projetoId) {
        // ARMAZENAMENTO DO CONTEXTO - Salva ID do projeto no localStorage para acesso na próxima página
        localStorage.setItem('projetoAtual', projetoId);
        
        // REDIRECIONAMENTO - Navega para página de detalhes
        window.location.href = 'projeto-detalhes.html';
    }

    // FUNÇÃO DE EXCLUSÃO - Remove projeto da lista com confirmação do usuário
    function excluirProjeto(projetoId) {
        // CONFIRMAÇÃO DO USUÁRIO - Solicita confirmação antes de excluir
        if (confirm('Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.')) {
            // CARREGAMENTO DE DADOS - Obtém lista atual de projetos
            let projetos = JSON.parse(localStorage.getItem('projetos')) || [];
            
            // FILTRAGEM - Remove projeto específico da lista
            projetos = projetos.filter(projeto => projeto.id !== projetoId);
            
            // SALVAMENTO - Atualiza localStorage com nova lista
            localStorage.setItem('projetos', JSON.stringify(projetos));
            
            // ATUALIZAÇÃO DA INTERFACE - Recarrega lista de projetos na tela
            carregarProjetos();
        }
    }

    // EXPOSIÇÃO GLOBAL - Torna funções acessíveis globalmente para uso em onclick
    window.verDetalhes = verDetalhes;
    window.excluirProjeto = excluirProjeto;