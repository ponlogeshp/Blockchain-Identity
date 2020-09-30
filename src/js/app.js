App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },
  
  initWeb3: function()
  {
	//alert("initweb3");
	if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'){
	//getting Permission to access. This is for when the user has new MetaMask
	window.ethereum.enable();
	App.web3Provider = window.ethereum;
	web3 = new Web3(window.ethereum);
	}else if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
	web3 = new Web3(window.web3.currentProvider);
	// Acccounts always exposed. This is those who have old version of MetaMask
	} else {
	// Specify default instance if no web3 instance provided
	App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
	web3 = new Web3(App.web3Provider);
	}
    return App.initContract();
  },
  
  initContract: function() {
	//alert("initContract");
    $.getJSON("identity.json", function(identity) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Identity = TruffleContract(identity);
      // Connect provider to interact with contract
      App.contracts.Identity.setProvider(App.web3Provider);
      return App.render();
    });
  },
  
  render: function() {
	//alert("render");
	web3.eth.getCoinbase(function(err, account) {
      if (err === null)
	  {
        App.account = account;
        $(".lead").html("Your Account: " + account);
		$("#cardtitle").html("STATUS OF REQUEST AND RESPONSE=>" + account);
		$("#cardtitle1").html("OVERALL ACCOUNT STATUS");
      }
    });
	web3.eth.getBlockNumber(function (error, result) {
        if(!error){
            $(".mb-0").html(result);
			t=result;
        }
        else{
			$("#block").html("Error");
        }
    });
	App.contracts.Identity.deployed().then(function(instance) {
      rinstance1=instance;
	  console.log("instance1 assigned");
	  return rinstance1.account();
	  }).then(function(account){
	  var header=$("#accResults");
      var results = $("#accshowResults");
	  var accnt= $("#accnt");
	  header.empty();
	  var headerTemplate="<tr><th>Account id</th><th>Account Address</th><th>Identity Name</th><th>Status</th></tr>";
	  header.append(headerTemplate);
      results.empty();
	  //alert("hello");
      for (var j =1;j <=account; j++)
	  {
          rinstance1.acc(j).then(function(ac) {
          var t1 = ac[0];
          var t2 = ac[1];
		  var t4 = ac[3];
		  var t5 = ac[4];
		  var accTemplate = "<tr><td>" + t1 + "</td><td>" + t2 + "</td><td>" + t4 + "</td><td>" + t5 + "</td></tr>";
		  results.append(accTemplate);
		  if(t5=="Not Allotted")
			var accountoption = "<option>" + t2 + "</ option>";
		  accnt.append(accountoption);
		  });
      }
	  }).catch(function(error) {
      console.warn(error);
      });
	},
	sub:function() 
   {
	  var usrname=$('#uname').val();
	  var vname=$('#vname').val();
	  var docname=$('#inpsel').val();
	  var hash;
	  event.preventDefault();
	  console.log("submitted");
	  const IPFS=require('ipfs-http-client');
	  const ipfs=new IPFS({host:'ipfs.infura.io',port:5001,protocol:'https', apiPath: '/api/v0'});
	  console.log(ipfs);	
	  async function foo()
	  {
			for await (var file of ipfs.add({path: vname, content: Buffer.from(buffer)}))
			{
				alert("File added to IPFS and Hash returned..");
				console.log(file);
				console.log(file.cid.string);
				hash=file.cid.string;
				console.log(hash);
				return hash;
			}
	  }
	  foo().then(ipfshash =>
	  {
		  ipfshash=hash; 
		  App.contracts.Identity.deployed().then(function(instance) {
			return instance.uploaddocument(usrname,vname,docname,ipfshash, { from: App.account });
			}).then(function(result) {
				alert("Transaction Hash Stored in Blockchain..");
			}).catch(function(err) {
				console.error("error in metamask and form interaction"+err);
			})
	  })
  },
  change:function(input)
  {
	  //alert("Capturing File...");
	  console.log("captured file");
	  const file=input.files[0];
	  const reader=new window.FileReader();
	  reader.readAsArrayBuffer(file);
	  reader.onload=function(){
		  buffer=reader.result;
		  console.log(buffer);
	  }
  },	  
  create:function()
  {
	 var orgname = $('#inputorgName').val();
	 var uname = $('#inputuser').val();
	 var un=   $('#pkey').val();
	 var sel = $('#inputsel').val();
	 App.contracts.Identity.deployed().then(function(instance) {
      return instance.createacc(orgname,uname,un,sel,{ from: App.account });
    }).then(function(result) {
			alert("Transaction recorded in Blockchain..");
    }).catch(function(err) {
		console.error("error in metamask and form interaction"+err);
    });
  },
  addacc:function()
  {
	 var idname = $('#inputorgName').val();
	 var accnt = $('#inputuser').val();
	 App.contracts.Identity.deployed().then(function(instance) {
      return instance.addaccount(idname,accnt,{ from: App.account });
    }).then(function(result) {
			alert("Transaction recorded in Blockchain..");
    }).catch(function(err) {
		console.error("error in metamask and form interaction"+err);
    });
  },  
	upload: function() {
	alert("Upload Data...");
    var inputuserName = $('#inputuserName').val();
	var inputfatherName = $('#inputfatherName').val();
	var inputgen = $('#inputgen').val();
	var inputEmail = $('#inputEmail').val();
	var inputMobile = $('#inputMobile').val();
	var inputaddress = $('#inputaddress').val();
    App.contracts.Identity.deployed().then(function(instance) {
      return instance.createdata(inputuserName,inputfatherName,inputgen,inputEmail,inputMobile,inputaddress, { from: App.account });
    }).then(function(result) {
			alert("Transaction Data recorded in Blockchain..");
    }).catch(function(err) {
		console.error("error in metamask and form interaction"+err);
    });
  },
  reqtrans: function() {
	alert("Request Data....");
	var orgname = $('#inputorgName').val();
    var uname = $('#inputuser').val();
	var sel = $('#inputsel').val();
	var desc = $('#desc').val();
	alert(orgname);
	alert(uname);
	alert(sel);
	alert(desc);
	var acc1=("0xf573d743ae941c2444aecd2b19cee8ed34b81319").toString();
	var acc2=("0x82d115cd63983d7fbb51bacd3263c75605b5e723").toString();
		if(uname=="PON LOGESH P")
			var to=acc1;
		else if(uname=="AJAY S")
			var to=acc2;
		else
			var to=App.account;
	alert(to);
    App.contracts.Identity.deployed().then(function(instance)
	{
      return instance.requestdata(orgname,uname,sel,desc,to,{ from: App.account });
    }).then(function(result) {
			alert("Request Transaction!!! recorded in Blockchain..");
    }).catch(function(err) {
		console.error("error in metamask and form interaction"+err);
    });
  },
  reqdoc: function() 
  {
	alert("Request Document...");
    var org = $('#inputorg').val();
	var username = $('#inputusern').val();
	var typed = $('#inputselect').val();
	var purp = $('#purpose').val();
	alert(org);
	alert(username);
	alert(typed);
	alert(purp);
	var acc1=("0xf573d743ae941c2444aecd2b19cee8ed34b81319").toString();
	var acc2=("0x82d115cd63983d7fbb51bacd3263c75605b5e723").toString();
		if(username=="PON LOGESH P")
			var to=acc1;
		else if(username=="AJAY S")
			var to=acc2;
		else
			var to=App.account;
			//console.log(App.account);
			App.contracts.Identity.deployed().then(function(instance)
			{
				return instance.requestdocument(org,username,typed,purp,to,{ from: App.account });
			}).then(function(result) {
					alert("Request Transaction!!! recorded in Blockchain..");
			}).catch(function(err) {
			console.error("error in metamask and form interaction"+err);
			});
  },
  reject: function(k,reqd)
  {
	    var p=0;
		if(k==1)
		{
		  App.contracts.Identity.deployed().then(function(instance) {
			return instance.addresponse(reqd,k,p, { from: App.account });
			}).then(function(result) {
					alert("Response Transaction recorded in Blockchain..");
					location.reload(true);
		  }).catch(function(err) {
			console.error("error in metamask and form interaction"+err);
		  });
		}
	  else
	  {
		  App.contracts.Identity.deployed().then(function(instance) {
			return instance.addresponse(reqd,k,p, { from: App.account });
			}).then(function(result) {
					location.reload(true);
					alert("Response Transacction recorded in Blockchain..");
		  }).catch(function(err) {
			console.error("error in metamask and form interaction"+err);
		  });
	  } 
  },
  show: function(k,pid,nme)
  {
		if(k==1)
		{
			App.contracts.Identity.deployed().then(function(instance) {
			rinstance=instance;
			return rinstance.regCount();
			}).then(function(regCount){
			for (var i = 1; i <= regCount; i++)
			{
				    rinstance.users(i).then(function(user) {
					if(nme===user[1])
					{
							alert("Requested data\nOwner Name : "+nme+"\nData : " + user[pid]);
							return;
					}
				});
			}
			}).catch(function(error) {
				console.warn(error);
			});
		}
		else
		{
		  //alert("good demo");
		  var good=$("#good");
		  App.contracts.Identity.deployed().then(function(instance) {
		  rinstance=instance;
		  return rinstance.dcount();
		  }).then(function(dcount){
		  for (var i = 1; i <= dcount; i++)
		  {
					rinstance.docs(i).then(function(doc) {
						//alert(nme);
						//alert(doc[1]);
					if(nme===doc[1])
					{
							//alert(pid);
							//alert(doc[3]);
							if(pid===doc[3])
							{
								var link= "https://gateway.ipfs.io/ipfs/";
								link=link+doc[4];
								alert("Click the Show Document Link to View the Document.");
								var template = "<table><tr style='color:red; font-size:25px;'><td>Requested Document</td></tr><tr><td style='color:blue; font-size:30px;'>Owner name=>\""+ doc[1] + "\"</td></tr><tr><td style='color:green; font-size:30px;'>Document Name=>\""+ doc[3] + "\" </td></tr><tr style='color:red; font-size:35px;'><td><a href=\""+ link + "\">Show_Document</a></td></tr>";  
								good.append(template);
								return;
							}
					}
					else
					{
						alert("Error!!! No such user");
					}		
				});
		  }
		  }).catch(function(error) {
				console.warn(error);
		  }); 
		} 
  },  
  provide: function(k,reqd)
  {
	    var p=1;
		if(k==1)
		{
		  //alert(k);
		  App.contracts.Identity.deployed().then(function(instance) {
			return instance.addresponse(reqd,k,p, { from: App.account });
			}).then(function(result) {
					alert("Response added to blockchain Successfully!!!");
					location.reload(true);
		  }).catch(function(err) {
			console.error("error in metamask and form interaction"+err);
		  });
		}
	  else
	  {
		  App.contracts.Identity.deployed().then(function(instance) {
			return instance.addresponse(reqd,k,p, { from: App.account });
			}).then(function(result) {
					alert("Response added to blockchain Successfully!!!");
					location.reload(true);
		  }).catch(function(err) {
			console.error("error in metamask and form interaction"+err);
		  });
	  } 
  },
  display: function(j)
  {
	//alert(j);
	var recv=(App.account).toString();
	alert("App=> " +recv);
	var acc1=("0xf573d743ae941c2444aecd2b19cee8ed34b81319").toString();
	var acc2=("0x82d115cd63983d7fbb51bacd3263c75605b5e723").toString();
	alert("Account"+ acc1);
	if(recv===acc1 || recv===acc2)
	{
	 if(j==1)
	 {
		//alert("value " +j);
		var rinstance;
		App.contracts.Identity.deployed().then(function(instance) {
		rinstance=instance;
		return rinstance.transCount();
		}).then(function(transCount){
		var header=$("#headerResults");
		var results = $("#displayResults");
		var good=$("#good");
		header.empty();
		var headerTemplate="<tr><th>Request Id</th><th>Organization</th><th>Requested data</th><th>Description</th><th>Status</th></tr>";
		header.append(headerTemplate);
		results.empty();
		good.empty();
		for (var i = 101; i <= transCount; i++)
		{
          rinstance.dtrans(i).then(function(dtran) {
          var t1 = dtran[0];
          var t2 = dtran[1];
		  var t5 = dtran[3];
		  var t6 = dtran[4];
		  var t8 = dtran[7];
		  var t9 = dtran[8];
		  var ac = dtran[6];
		  //alert(t8);
		  //alert(t9);
		  //alert("Current Account" +ac);
		  if(recv===ac)
		  {
			  if(t8==false && t9=="NA")
			  {
				var resultTemplate = "<tr><td>" + t1 + "</td><td>" + t2 +"</td><td>" + t5 + "</td><td>" + t6 + "</td><td id='status'><button id='but1' type='button' onclick='App.provide(1,"+t1+"); return false;' class='btn btn-primary'>Accept</button><br><br><button onclick='App.reject(1,"+t1+"); return false;' id='but2' class='btn btn-space btn-secondary'>Reject</button></tr>";
				results.append(resultTemplate);
			  }
			  else if(t8==true && t9=="Updated")
			  {
				 var resultTemplate = "<tr><td>" + t1 + "</td><td>" + t2 + "</td><td>" + t5 + "</td><td>" + t6 + "</td><td style='color:green; font-weight:strong;' id='status'>GRANTED<td></tr>";
		     	 results.append(resultTemplate);
			  }
			  else if(t8==false && t9=="Updated")
			  {
			     var resultTemplate = "<tr><td>" + t1 + "</td><td>" + t2 + "</td><td>" + t5 + "</td><td>" + t6 + "</td><td style='color:red; font-weight:strong;' id='status'>REJECTED<td></tr>";
		     	 results.append(resultTemplate);
			  }
			  else
			  {
				  alert("error");
			  }
		  }
		  });
	    }
		}).catch(function(error) {
		console.warn(error);
		});
	 }
	 else
	 {
		var rinstance1;
		App.contracts.Identity.deployed().then(function(instance) {
		rinstance1=instance;
		return rinstance1.ktcount();
		}).then(function(ktcount){
		var header=$("#headerResults");
		var results = $("#displayResults");
		var good=$("#good");
		header.empty();
		var headerTemplate="<tr><th>Request Id</th><th>Organization</th><th>Requested document</th><th>Description</th><th>Status</th></tr>";
		header.append(headerTemplate);
		results.empty();
		good.empty();
		for (var j = 501;j <=ktcount; j++)
		{
          rinstance1.ktrans(j).then(function(ktran) {
          var t1 = ktran[0];
          var t2 = ktran[1];
		  var t4 = ktran[3];
		  var t5 = ktran[4];
		  var t8 = ktran[7];
		  var t9 = ktran[8];
		  if(t8==false &&t9=="NA")
		  {
				    var resultTemplate = "<tr><td>" + t1 + "</td><td>" + t2 + "</td><td>" + t4 + "</td><td>" + t5 + "</td><td id='status'><button id='but1' type='button' onclick='App.provide(2,"+t1+"); return false;' class='btn btn-primary'>Accept</button><br><br><button onclick='App.reject(2,"+t1+"); return false;' id='but2' class='btn btn-space btn-secondary'>Reject</button></tr></tr>";
					results.append(resultTemplate);
		  }
		  else if(t8==true && t9=="Updated")
		  {
				   var resultTemplate = "<tr><td>" + t1 + "</td><td>" + t2 + "</td><td>" + t4 + "</td><td>" + t5 + "</td><td style='color:green; font-weight:strong;' id='status'>GRANTED</td></tr>";
		     	   results.append(resultTemplate);
		  }
		  else if(t8==false && t9=="Updated")
		  {
				   var resultTemplate = "<tr><td>" + t1 + "</td><td>" + t2 + "</td><td>" + t4 + "</td><td>" + t5 + "</td><td style='color:red; font-weight:strong;' id='status'>REJECTED</td></tr>";
		     	   results.append(resultTemplate);
		  }	
          else
          {
				alert("error");
		  }
		  });
		}
		}).catch(function(error) {
		console.warn(error);
		});
      }
    }
	else
	{	
	 if(j==1)
	 {
	  //alert(j);
	  var rinstance;
	  var rit;
	  //alert("good");
	  App.contracts.Identity.deployed().then(function(instance) {
      rinstance=instance;
	  return rinstance.transCount();
	  }).then(function(transCount){
		  //alert("transaction count"+transCount);
	  var header=$("#headerResults");
      var results = $("#displayResults");
	  var good=$("#good");
	  header.empty();
	  var headerTemplate="<tr><th>Request Id</th><th>Identity Holder</th><th>Requested data</th><th>Description</th><th>Status</th></tr>";
	  header.append(headerTemplate);
      results.empty();
	  good.empty();
	  //alert("display");
      for (var i = 101; i <= transCount; i++)
	  {
          rinstance.dtrans(i).then(function(dtran) {
          var t1 = dtran[0];
          var t2 = dtran[1];
		  var t3 = dtran[2];
		  var t5 = dtran[3];
		  var t6 = dtran[4];
		  var t7 = dtran[6];
		  var t8 = dtran[7];
		  var t9 = dtran[8];
		  var lstr=t5.toString().toLowerCase();
		  if(lstr===name)
			  y=1;
		  else if(lstr==="gender")
			  y=3;
		  else if(lstr==="email")
			  y=4;
		  else if(lstr==="mobile")
			  y=5;
		  else if(lstr==="address")
			  y=6;
		  else
			  y=2;
		  console.log(y);
		  if(t8==false &&t9=="NA")
		  {
				    var resultTemplate = "<tr><td>" + t1 + "</td><td>" + t3 + "</td><td>" + t5 + "</td><td>" + t6 + "</td><i><td id='gstatus' style='color:blue;'>Pending...</td></i></tr>";
					results.append(resultTemplate);
		  }
		  else if(t8==true && t9=="Updated")
		  {
				   var resultTemplate = "<tr><td>" + t1 + "</td><td>" + t3 + "</td><td>" + t5 + "</td><td>" + t6 + "</td><td id='status'><button id='but1' type='button' onclick='App.show(1,"+y+",\""+ t3 + "\"); return false;' class='btn btn-primary'>View Data</button></td></tr>";
				   results.append(resultTemplate);
		  }
		  else if(t8==false && t9=="Updated")
		  {
				   var resultTemplate = "<tr><td>" + t1 + "</td><td>" + t3 + "</td><td>" + t5 + "</td><td>" + t6 + "</td><i><td style='color:red; font-weight:strong;' id='status'>Rejected by owner</td></i></tr>";
				   results.append(resultTemplate);
		  }	
          else
          {
				alert("error");
		  }
        });
      }
	  }).catch(function(error) {
      console.warn(error);
      });
	 }
	 else
	 {
	  var rinstance1;
	  App.contracts.Identity.deployed().then(function(instance) {
      rinstance1=instance;
	  console.log("instance1 assigned");
	  return rinstance1.ktcount();
	  }).then(function(ktcount){
	  var header=$("#headerResults");
      var results = $("#displayResults");
	  var good=$("#good");
	  header.empty();
	  var headerTemplate="<tr><th>Request Id</th><th>Identity Name</th><th>Requested document</th><th>Description</th><th>Status</th></tr>";
	  header.append(headerTemplate);
      results.empty();
	  good.empty();
      for (var j = 501;j <=ktcount; j++)
	  {
          rinstance1.ktrans(j).then(function(ktran) {
          var t1 = ktran[0];
          var t2 = ktran[1];
		  var t3 = ktran[2];
		  var t4 = ktran[3];
		  var t5 = ktran[4];
		  var t8 = ktran[7];
		  var t9 = ktran[8];
		  var lstr=t4.toString();
		  console.log(lstr);
		  if(t8==false &&t9=="NA")
		  {
				    var resultTemplate = "<tr><td>" + t1 + "</td><td>" + t3 + "</td><td>" + t4 + "</td><td>" + t5 + "</td><i><td id='gstatus' style='color:blue;'>Pending...</td></i></tr>";
					results.append(resultTemplate);
		  }
		  else if(t8==true && t9=="Updated")
		  {
				   var resultTemplate = "<tr><td>" + t1 + "</td><td>" + t3 + "</td><td>" + t4 + "</td><td>" + t5 + "</td><td id='status'><button id='but1' type='button' onclick='App.show(2,\""+ lstr + "\",\""+ t3 + "\"); return false;' class='btn btn-primary'>View Document</button></td></tr>";
				   results.append(resultTemplate);
		  }
		  else if(t8==false && t9=="Updated")
		  {
				   var resultTemplate = "<tr><td>" + t1 + "</td><td>" + t3 + "</td><td>" + t4 + "</td><td>" + t5 + "</td><i><td style='color:red; font-weight:strong;' id='status'>Rejected by Owner</td></i></tr>";
				   results.append(resultTemplate);
		  }	
          else
          {
				alert("error");
		  }
			});
      }
	  }).catch(function(error) {
      console.warn(error);
      });
     }
    }
  }
};  

$(function() {
  $(window).load(function() {
	  //alert("load");
    App.init();
  });
});