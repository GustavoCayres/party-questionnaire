RESULTS_PAGE_PATH = "/finish-questionnaire.html";
QUESTION_PATHS = [
    "/questions/Alessandro Matielo/questão1(1).html",
    "/questions/Davy 3A, eletiva/site.html",
    "/questions/Gabriel Tucci/tucci.html",
    "/questions/Lukas Barros/pergunta1.html",
    "/questions/Nycolas Marques/pergunta1.html",
    "/questions/Roger Luiz/pergunta1.html",
    "/questions/Sarah Iraci/pergunta.1.html",
    "/questions/Thiago A/neckklace_lindo.html"
].map(encodeURI);
API_KEY = "AIzaSyDOtlakOZULcEp_CbdMTioc0HNDKh0KUcM";
SPREADSHEET_ID = "14YIQdUYkLFqm6xNyYBVXCAMSsyUq5BHPV_ZF5iDRq-U";
SHEET_NAME="Answers";
function startRound(playerName) {
    // Salva o nome do jogador e o início da rodada no localstorage.
    localStorage.setItem("playerName", playerName);
    localStorage.setItem("roundStart", Date.now());
    localStorage.setItem("currentQuestion", -1);
    console.log("Round started!");
    goToNextQuestion();
}

function answer(selectedAlternative) {
    // Salva a alternativa selecionada para a questão sendo respondida.
    localStorage.setItem(window.location.pathname, selectedAlternative);
    goToNextQuestion();
}

async function submitAnswers() {
    // Envia as respostas, junto com o nome do jogador e o horário de início do questionário, para o banco de dados.
    var playerName = localStorage.getItem("playerName");
    var roundStart = localStorage.getItem("roundStart");
    var answers = QUESTION_PATHS.map(question => localStorage.getItem(question));
    var values = [[playerName, roundStart, ...answers]];
    await spreadsheetAppend(SPREADSHEET_ID, SHEET_NAME, values);
    console.log("Answers submitted!");
}

function goToNextQuestion() {
    // Checa o localstorage para ver qual é a próxima questão.
    // Se não houver próxima questão, redireciona para a página de resultados.
    // Se 'currentQuestion' não estiver definido, vai para a primeira questão.
    var currentQuestion = localStorage.getItem("currentQuestion");
    var nextQuestion = parseInt(currentQuestion) + 1;
    if (nextQuestion >= QUESTION_PATHS.length) {
        window.location.href = RESULTS_PAGE_PATH;
    }
    else {
        localStorage.setItem("currentQuestion", nextQuestion);
        window.location.href = QUESTION_PATHS[nextQuestion];
    }
}

async function spreadsheetAppend(spreadsheetId, sheetName, values) {
    // Appends a row to a Google Spreadsheet, using a PipeDream webhook.
    // See https://pipedream.com/@dylburger/google-sheets-api-append-row-p_8XVYjJ/readme
    var url = "https://eotozuv39f2goux.m.pipedream.net";
    var data = {
        "spreadsheetId": spreadsheetId,
        "sheetName": sheetName,
        "values": values
    };
    await fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(data)
    });
}
