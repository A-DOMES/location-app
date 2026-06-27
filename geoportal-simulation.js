// geoportal-simulation.js
// ✅ 이 파일은 팝업 UI와 투자 시뮬레이션 계산 로직을 담당합니다.
// ✅ geoportal.html에서 API 응답을 parcelData 객체로 전달받아 처리합니다.

// ✅ 팝업 렌더링 함수
function renderPopup(parcelData) {
  const popup = document.getElementById("infoPopup");
  popup.style.display = "block";

  // ✅ 면적 변환 (㎡ → 평)
  const areaSqm = parcelData.areaSqm || 0;
  const areaPy = (areaSqm / 3.3058).toFixed(2);

  // ✅ 가격 계산
  const pricePerSqm = parcelData.pricePerSqm || 0;   // 공시지가 (㎡당)
  const tradePrice = parcelData.tradePrice || 0;     // 실거래가 (만원 단위)
  const estateTotal = (pricePerSqm * areaSqm).toLocaleString(); // 공시지가 기준 총액(원)
  const tradeTotal = (tradePrice * 10000).toLocaleString();     // 실거래가 기준 총액(원)

  // ✅ 기본 정보 표시
  document.getElementById("landBuildingInfo").innerHTML = 
    `<h4>🏢 건물 정보</h4><p>${parcelData.buildingInfo || '조회 실패'}</p>`;
  
  document.getElementById("landUseInfo").innerHTML = 
    `<h4>📜 토지 이용</h4><p>${parcelData.landUseInfo || '조회 실패'}</p>`;
  
  document.getElementById("realEstateInfo").innerHTML = 
    `<h4>💰 공시지가</h4>
     <p>단가: ${pricePerSqm ? pricePerSqm.toLocaleString() + " 원/㎡" : "조회 실패"}</p>
     <p>면적: ${areaSqm}㎡ (${areaPy}평)</p>
     <p>총액: ${pricePerSqm ? estateTotal + " 원" : "데이터 없음"}</p>`;
  
  document.getElementById("realTransactionInfo").innerHTML = 
    `<h4>📊 실거래가</h4>
     <p>거래금액: ${tradePrice ? tradePrice.toLocaleString() + " 만원" : "조회 실패"}</p>
     <p>총액: ${tradePrice ? tradeTotal + " 원" : "데이터 없음"}</p>
     <p>면적: ${areaSqm}㎡ (${areaPy}평)</p>`;

  // ✅ 투자 시뮬레이션 입력창 추가
  renderInputs(parcelData);
}

// ✅ 입력창 생성 함수
// - 사용자 입력: 대출금, 이자율, 상환기간, 월 임대료
// - "계산하기" 버튼 클릭 시 simulateInvestment 실행
function renderInputs(parcelData) {
  const popup = document.getElementById("infoPopup");

  // ⚠️ 중복 방지: 기존 입력창 제거
  const oldSimCard = document.querySelector(".info-card");
  if (oldSimCard) oldSimCard.remove();

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

  // ✅ 버튼 이벤트 → 입력값 검증 후 계산 실행
  document.getElementById("simulateBtn").addEventListener("click", () => {
    const userInput = {
      loanAmount: Number(document.getElementById("loanAmount").value),
      interestRate: Number(document.getElementById("interestRate").value),
      loanYears: Number(document.getElementById("loanYears").value),
      rentIncome: Number(document.getElementById("rentIncome").value)
    };

    // ⚠️ 입력값 검증
    if (userInput.loanAmount <= 0 || userInput.interestRate <= 0 || userInput.loanYears <= 0) {
      alert("대출금, 이자율, 상환기간은 0보다 커야 합니다.");
      return;
    }

    const result = simulateInvestment(userInput, parcelData);
    renderResults(result);
  });
}

// ✅ 투자 계산 함수
// - 월 상환액 (원리금균등 공식)
// - 월 순수익 (임대료 - 상환액)
// - 연 수익률 (공시지가 기준 vs 실거래가 기준)
function simulateInvestment(userInput, parcelData) {
  const months = userInput.loanYears * 12;
  const monthlyRate = userInput.interestRate / 100 / 12;
  const monthlyPayment = (userInput.loanAmount * monthlyRate) / 
    (1 - Math.pow(1 + monthlyRate, -months));

  const netIncome = userInput.rentIncome - monthlyPayment;

  // ✅ 연 수익률 계산
  const estateTotal = parcelData.pricePerSqm * parcelData.areaSqm; // 공시지가 기준 총액(원)
  const tradeTotal = parcelData.tradePrice * 10000;                // 실거래가 기준 총액(원)
  const annualRent = userInput.rentIncome * 12;

  const estateYield = estateTotal ? ((annualRent / estateTotal) * 100).toFixed(2) : '-';
  const tradeYield = tradeTotal ? ((annualRent / tradeTotal) * 100).toFixed(2) : '-';

  return {
    monthlyPayment: monthlyPayment.toFixed(0),
    netIncome: netIncome.toFixed(0),
    estateYield,
    tradeYield
  };
}

// ✅ 결과 표시 함수
// - 월 상환액, 월 순수익, 연 수익률(공시지가 기준/실거래가 기준) 출력
function renderResults(result) {
  document.getElementById("simulationResult").innerHTML = `
    <p>월 상환액: ${result.monthlyPayment} 원</p>
    <p>월 순수익: ${result.netIncome} 원</p>
    <p>연 수익률(공시지가 기준): ${result.estateYield} %</p>
    <p>연 수익률(실거래가 기준): ${result.tradeYield} %</p>
  `;
}
