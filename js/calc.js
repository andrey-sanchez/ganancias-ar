function calcular() {
    var sueldoBruto = $("#sueldoBruto").val(),
        isConyuge = $("input[name='conyuge']:checked").val(),
        // isJubilado = $("input[name='jubilado']:checked").val(),
        isJubilado = 0;
        isPatagonico = $("input[name='patagonico']:checked").val(),
        valorAlquiler = $("#alquiler").val(),
        deduccionAlquiler = 12 * valorAlquiler * .4 > TOPE_ALQUILER ? TOPE_ALQUILER : 12 * valorAlquiler * .4,
        valorEmpleada = $("#servicio-domestico").val(),
        deduccionEmpleada = 12 * valorEmpleada > TOPE_EMPLEADA ? TOPE_EMPLEADA : 12 * valorEmpleada,
        valorSeguroVida = $("#seguro-vida").val(),
        deduccionSeguroVida = 12 * valorSeguroVida > TOPE_SEGURO_VIDA ? TOPE_SEGURO_VIDA : 12 * valorSeguroVida,
        valorHipotecario = $("#hipotecario").val(),
        deduccionHipotecario = 12 * valorHipotecario > TOPE_HIPOTECARIO ? TOPE_HIPOTECARIO : 12 * valorHipotecario,
        hijosElement = document.getElementById("hijos"),
        cantHijos = hijosElement.options[hijosElement.selectedIndex].value,
        sueldoNeto = 0 == isJubilado ? .17 * sueldoBruto > TOPE_APORTES ? sueldoBruto - TOPE_APORTES : .83 * sueldoBruto : .06 * sueldoBruto > TOPE_APORTES ? sueldoBruto - TOPE_APORTES : .94 * sueldoBruto;

    var sueldoNetoAnual = 13 * sueldoNeto,
        mniConDeduccionEspecial = (MINIMO_NO_IMPONIBLE + ADICIONAL_4TA_CATEGORIA) * (1.22 * isPatagonico + (1 - isPatagonico));
    mniTotal = (mniConDeduccionEspecial + CONYUGE * isConyuge + HIJO * cantHijos + deduccionAlquiler + deduccionEmpleada + deduccionSeguroVida + deduccionHipotecario ) * (1 - isJubilado) + isJubilado * (TOPE_JUBILADO + deduccionAlquiler + deduccionEmpleada + deduccionSeguroVida + deduccionHipotecario ),
        montoImponibleAplicable = 0,
        mniTotal < sueldoNetoAnual && (montoImponibleAplicable = sueldoNetoAnual - mniTotal);
    
    var result = calcularImpuesto(montoImponibleAplicable);
    impuestoAnual = result.value.toFixed(2), $("#impuestoAnual").text("$" + impuestoAnual);

    var impuestoMensual = (impuestoAnual / 12).toFixed(2);
    $("#impuestoMensual").text("$" + impuestoMensual);
    var alicuota = impuestoMensual / sueldoBruto * 100;
    $("#alicuota").text(alicuota.toFixed(2) + "%");
    var alicuotaMarginal = 0 == alicuota ? 0 : 100 * porcentajesEscalas[result.escala];
    $("#alicuotaMarginal").text(alicuotaMarginal.toFixed(2) + "%");
    var sueldoEnMano = sueldoNeto - impuestoMensual;
    $("#sueldoEnMano").text("$" + Math.round(sueldoEnMano) + ".00")

    let descuentos = sueldoBruto - sueldoNeto;
    $("#deducciones").html("$" + descuentos.toFixed(2))

    if (sueldoBruto !== 0) {
        $("#valores, #resultados").removeClass("active");
    }
}

function calcularImpuesto(monto) {
    var i = 0;
    var result = {};
    var value = 0;
    while (monto > topesEscalas[i]) {
        var diff = i == 0 ? topesEscalas[i] : topesEscalas[i] - topesEscalas[i - 1];
        value += diff * porcentajesEscalas[i];
        i++;
    }

    diff = i == 0 ? monto : monto - topesEscalas[i - 1];
    value += diff * porcentajesEscalas[i];

    result.value = value;
    result.escala = i;
    return result;
}

$(document).ready(function() {
    $("#calcular").on("click", function () {
        calcular()
    }), $(document).keypress(function (a) {
        13 == a.keyCode && (a.preventDefault(), calcular())
    }), $("input[name='jubilado']").click(function () {
        $("input[name='conyuge']").attr({
            disabled: 1 == $(this).val()
        }), $("input[name='patagonico']").attr({
            disabled: 1 == $(this).val()
        })
    });
    
    $('#alquiler').on('change', function (event) {
        event.preventDefault();
        if ($(this).val() !== '') {
            $("#hipotecario").val('');
            $("#hipotecario").attr("disabled", true);
        } else {
            $("#hipotecario").attr("disabled", false);
        }
    });

    $('#hipotecario').on('change', function (event) {
        event.preventDefault();
        if ($(this).val() !== '') {
            $("#alquiler").val('');
            $("#alquiler").attr("disabled", true);
        } else {
            $("#alquiler").attr("disabled", false);
        }
    });
});
var topesEscalas = [64532.64, 129065.29, 193597.93, 258130.58, 387195.86, 516261.14, 774391.71, 1032522.30, 99999999],
    porcentajesEscalas = [.05, .09, .12, .15, .19, .23, .27, .31, .35],
    MINIMO_NO_IMPONIBLE = 167678.40,
    ADICIONAL_4TA_CATEGORIA = 804856.32,
    CONYUGE = 156320.63,
    HIJO = 78833.08,
    TOPE_APORTES = 208357.30,
    TOPE_JUBILADO = 1484752.88, 
    TOPE_ALQUILER = 167678.40,
    TOPE_EMPLEADA = 167678.40,
    TOPE_SEGURO_VIDA = 24000,
    TOPE_HIPOTECARIO = 20000;
