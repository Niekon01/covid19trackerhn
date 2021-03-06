function formatNum(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
states = {
	TT: "टोटल",
    MH: "महाराष्ट्र",
    GJ: "गुजरात",
    DL: "दिल्ली",
    RJ: "राजस्थान",
    MP: "मध्य प्रदेश",
    TN: "तमिल नाडु",
    UP: "उत्तर प्रदेश",
    AP: "आन्ध्र प्रदेश",
    TG: "तेलंगाना",
    WB: "पश्चिम बंगाल",
    JK: "जम्मू और कश्मीर",
    KA: "कर्नाटक",
    KL: "केरल",
    PB: "पंजाब",
    HR: "हरियाणा",
    BR: "बिहार",
    OR: "ओडिशा",
    JH: "झारखण्ड",
    UT: "उत्तराखण्ड",
    HP: "हिमाचल प्रदेश",
    CT: "छत्तीसगढ़",
    AS: "असम",
    CH: "चण्डीगढ़",
    AN: "अण्डमान और निकोबार द्वीपसमूह",
    LA: "लद्दाख",
    ML: "मेघालय",
    PY: "पुदुच्चेरी",
    GA: "गोवा",
    MN: "मणिपुर",
    TR: "त्रिपुरा",
    MZ: "मिज़ोरम",
    AR: "अरुणाचल प्रदेश",
    NL: "नागालैण्ड",
    DN: "दादरा और नगर हवेली",
    DD: "दमन और दीव",
    LD: "लक्षद्वीप",
    SK: "सिक्किम"
}


fetch('https://api.covid19india.org/data.json')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
    output = '<tr><th>राज्य/केंद्र शासित</th><th>संक्रमित मिले</th><th>अभी संक्रमित हैं</th><th>ठीक हुए</th><th>मृत्यु</th></tr>'
    for(i = 1; i < 38; i++) {
    	output += "<tr><td>" + states[data.statewise[i].statecode] + "</td><td>" + formatNum(data.statewise[i].confirmed) + "</td><td>" + formatNum(data.statewise[i].active) + "</td><td>" + formatNum(data.statewise[i].recovered) + "</td><td>" + formatNum(data.statewise[i].deaths) + "</td></tr>";
    }
    document.getElementById('loading').style.display = "none";
    document.getElementById('dataTable').innerHTML = output;

    // Total Report
    document.getElementById('totalConfirmed').innerHTML = formatNum(data.statewise[0].confirmed);
    document.getElementById('totalActive').innerHTML = formatNum(data.statewise[0].active);
    document.getElementById('totalRecovered').innerHTML = formatNum(data.statewise[0].recovered);
    document.getElementById('totalDeaths').innerHTML = formatNum(data.statewise[0].deaths);

    // Yesterday's Report
    date = new Date();
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    yesterday = new Date(date);
    yesterday.setDate(date.getDate() - 1);
    yesterday = yesterday.getDate() + " " + months[yesterday.getMonth()] + " ";


    for(i = 0; i < data.cases_time_series.length; i++) {
        if(data.cases_time_series[i].date == yesterday)
            latestDate = i;
    }
    //console.log(latestDate);

    document.getElementById('date').innerHTML = "( " + yesterday + ")";
    document.getElementById('yUntilCases').innerHTML = data.cases_time_series[latestDate].totalconfirmed;
    document.getElementById('yConfirmed').innerHTML = data.cases_time_series[latestDate].dailyconfirmed;
    document.getElementById('yRecovered').innerHTML = data.cases_time_series[latestDate].dailyrecovered;
    document.getElementById('yDeaths').innerHTML = data.cases_time_series[latestDate].dailydeceased;

    new_cases = parseInt(data.statewise[0].confirmed)-parseInt(data.cases_time_series[latestDate].totalconfirmed);
    if(new_cases > 0)
        new_cases = "+" + new_cases
    document.getElementById('new_cases').innerHTML = "[" + new_cases + "]";

    currConf = parseInt(data.statewise[0].confirmed) - parseInt(data.cases_time_series[latestDate].totalconfirmed);
    currRec = parseInt(data.statewise[0].recovered) - parseInt(data.cases_time_series[latestDate].totalrecovered);
    currDec = parseInt(data.statewise[0].deaths) - parseInt(data.cases_time_series[latestDate].totaldeceased);

    document.getElementById('todayStats').innerHTML = '<p>' + yesterday + 'से अब तक,</p><p><span style="color:red;"><b>' + currConf + '</b></span> नए संक्रमण के मामले सामने आये|</p><p><span style="color: green;"><b>' + currRec + '</b></span> ठीक हुए,</p><p>और <span style="color:gray;"><b>' + currDec + '</b></span> की मृत्यु की जानकारी मिली|</p>';
});
