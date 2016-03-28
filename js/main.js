$(init);

function init()
{	
	//when button with id btnDestroyPage is clicked, launch the destroy plugin
	$("#btnDestroyPage").on("click", function(e) {
		e.preventDefault();
		$("*").destroy({
			scoreKeeperBackgroundColor: "orange",
			gameCountDownTime: 10
		});
	});
}
