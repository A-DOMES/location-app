// geoportal-simulation.js

// ✅ 팝업 렌더링
function renderPopup(parcelData) {
  const popup = document.getElementById("infoPopup");
  popup.style.display = "block";

  // 기본 정보 표시
  document.getElementById("landBuildingInfo").innerHTML = 
    `<h4>🏢 건물 정보</h4><p>${parcelData.buildingInfo || '-'}</p>`;
  document.getElementById("landUseInfo").innerHTML = 
    `<h4>📜 토지 이용</h4><p>${parcelData.landUseInfo || '-'}</p>`;
  document.getElementById("realEstateInfo").innerHTML = 
    `<h4>💰 공시지가</h4><p>${parcelData.pricePerSqm || '-'} 원/㎡</p>`;
  document.getElementById("realTransactionInfo").innerHTML = 
    `<h4>📊 실거래가</h4><p>${parcelData.tradePrice || '-'} 원</p>`;

  // 투자 시뮬레이션 입력창 추가
  renderInputs();
}

// ✅ 입력창 생성
function renderInputs() {
  const popup = document.getElementById("infoPopup");
  const simCard = document.createElement("div");
  simCard.className = "info-card";
  simCard.innerHTML = `
    <h4>📈 투자 시뮬레이션</h4>
    <label>대출금: <input id="loanAmount" type="number"></label><br>
    <label>이자율(%): <input id="interestRate" type="number"></label><br>
    <label>상환기간(년): <input id="loanYears" type="number"></label><br>
    <label>월 임대료: <input id="rentIncome" type="number"></label><br>
    <button id="simulateBtn">계산하기</button>
    <div id="simulationResult"></div>
  `;
  popup.appendChild(simCard);

  document.getElementById("simulateBtn").addEventListener("click", () => {
    const userInput = {
      loanAmount: Number(document.getElementById("loanAmount").value),
      interestRate: Number(document.getElementById("interestRate").value),
      loanYears: Number(document.getElementById("loanYears").value),
      rentIncome: Number(document.getElementById("rentIncome").value)
    };
    const parcelData = {}; // 실제 데이터는 geoportal.html에서 전달
    const result = simulateInvestment(userInput, parcelData);
    renderResults(result);
  });
}

// ✅ 투자 계산
function simulateInvestment(userInput, parcelData) {
  // 간단 예시: 월 상환액 계산
  const months = userInput.loanYears * 12;
  const monthlyRate = userInput.interestRate / 100 / 12;
  const monthlyPayment = (userInput.loanAmount * monthlyRate) / 
    (1 - Math.pow(1 + monthlyRate, -months));

  const netIncome = userInput.rentIncome - monthlyPayment;

  return {
    monthlyPayment: monthlyPayment.toFixed(0),
    netIncome: netIncome.toFixed(0)
  };
}

// ✅ 결과 표시
function renderResults(result) {
  document.getElementById("simulationResult").innerHTML = `
    <p>월 상환액: ${result.monthlyPayment} 원</p>
    <p>월 순수익: ${result.netIncome} 원</p>
  `;
}
