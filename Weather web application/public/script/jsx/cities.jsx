class CitiesTag extends React.Component{
	constructor(props){
		super(props);
		this.tagSearch = this.tagSearch.bind(this);
		this.deleteCity = this.deleteCity.bind(this);
	}

	//filled in search textfield with user's choose tag
	tagSearch(city){
		$("#searchTextField").val(city);
		searchCity(city);
	}

	deleteCity(city){
		var url = window.location.origin + "/api/users/deleteCity/"+city;
		
		$.ajax({
			type: "DELETE",
			cache: false,
			url: url,
			success: function (data) {
				if(data===false){
					alert("unable to delete this city");
				}else{
					deterShowUserInfo();
				}
			}, error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert("Network Error: unable to delete this city");
			}
		})
	}

	render(){
		//show the most recent 7 searched cities
		var cities = this.props.cities.reverse();
		if(cities.length>7){
			cities = cities.splice(0,6);
		}
		
		return(
			<div id="tagDiv">
				<span id="tagTitle">Search History<br/></span>
				
				{cities.map(city=>(
					<div className="tagDiv" key={"tag_"+city}>
						<a onClick={() => this.deleteCity(city)} className="idClose">X</a>
						<a onClick={() => this.tagSearch(city)} className="cityTag">{city}</a>
					</div>
				))}	
			</div>
		)
	}
}