var MinhaData = function(data){
	var meuMes = data.getMonth();
	var dia = "";
	var mes = "";
	
	this._setData = function(){
		if(meuMes == 0){
			mes = "Janeiro";
		}else if(meuMes ==1){
			mes = "Fevereiro"; 
		}else if(meuMes ==2){
			mes = "Março"; 
		}else if(meuMes ==3){
			mes = "Abril"; 
		}else if(meuMes ==4){
			mes = "Maio"; 
		}else if(meuMes ==5){
			mes = "Junho"; 
		}else if(meuMes ==6){
			mes = "Julho"; 
		}else if(meuMes ==7){
			mes = "Agosto"; 
		}else if(meuMes ==8){
			mes = "Setembro"; 
		}else if(meuMes ==9){
			mes = "Outubro"; 
		}else if(meuMes ==10){
			mes = "Novembro" 
		}else if(meuMes ==11){
			mes = "Dezembro";
		}
	}
	
	this.getMes = function(){
		this._setData();
		return mes;
	}
}