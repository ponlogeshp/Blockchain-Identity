pragma solidity ^0.5.0;
contract Identity 
{
  uint public regCount = 0;
  uint public transCount=100;
  uint public ktcount=500;
  uint public dcount=0;
  uint public respcount=0;
  uint public account=0;
  string ipfsHash;
  struct User
  {
    uint id;
    string name;
	string fname;
	string gender;
	string email;
	uint mobile;
	string addr;
	address owner;
  }
  struct Udoc
  {
	 uint docid;
	 string usrname;
	 string vname;
	 string docname;
	 string ipfshash;
	 address owner;
  }
  struct Dtrans
  {
	 uint tid;
	 string orgname;
	 string uname;
	 string sel;
	 string desc;
	 address owner;
	 address to;
	 bool status;
	 string upd;
  }
  struct Ktrans
  {
	 uint tranid;
	 string org;
	 string username;
	 string typed;
	 string purp;
	 address owner;
	 address to;
	 bool status; 
	 string upd;
  }
  struct Resp
  {
	 uint respid;
	 uint reqid;
	 address owner;
  }
  struct Acc
  {
	uint acid;
	address acaddr;
	string pkey;
	string aname;
	string stat;
  }
   mapping(uint=>Dtrans) public dtrans;  
   mapping(uint=>Ktrans) public ktrans; 
   mapping(uint=>User) public users;
   mapping(uint=>Udoc) public docs;
   mapping(uint=>Resp) public res;
   mapping(uint=>Acc) public acc;
  function createacc(address acaddr,string memory _pkey,string memory _aname,string memory _stat) public
  {
	 account++;
	 acc[account]=Acc(account,acaddr,_pkey,_aname,_stat);
  }
   
  function createdata(string memory _name,string memory _fname,string memory _gender,string memory _email,uint _mobile,string memory _addr) public 
  {
     regCount ++;
	 users[regCount] = User(regCount,_name,_fname,_gender,_email,_mobile,_addr,msg.sender);
  }
  
  function requestdata(string memory _orgname,string memory _uname,string memory _sel,string memory _desc,address _to) public 
  {
     transCount++;
	 dtrans[transCount] = Dtrans(transCount,_orgname,_uname,_sel,_desc,msg.sender,_to,false,"NA");
  }
  
  function requestdocument(string memory _org,string memory _username,string memory _typed,string memory _purp,address _to) public 
  {
     ktcount++;
	 ktrans[ktcount] = Ktrans(ktcount,_org,_username,_typed,_purp,msg.sender,_to,false,"NA");
  }
  
  function uploaddocument(string memory _usrname,string memory _vname,string memory _docname,string memory _ipfshash) public 
  {
     dcount++;
	 docs[dcount] = Udoc(dcount,_usrname,_vname,_docname,_ipfshash,msg.sender);
  }
  function addaccount(uint acid,string memory _name) public
  {
	Acc storage _a=acc[acid];
	_a.stat="Alloted";
	_a.aname=_name;
  }
    function addresponse(uint reqid,uint t,uint p) public 
    {
     respcount++;
	 Dtrans storage _dts = dtrans[reqid];
	 Ktrans storage _kts=ktrans[reqid];
	 if(p==1)
	 {
		if(t==1)
		{
			_dts.status=true;
			_dts.upd="Updated";
		}
		else
		{
			_kts.status=true;
			_kts.upd="Updated";
		}
		res[respcount] = Resp(respcount,reqid,msg.sender);
     }
	 else
	 {
		if(t==1)
			_dts.upd="Updated";
		else
			_kts.upd="Updated";
		res[respcount] = Resp(respcount,reqid,msg.sender);
     }
   }
}	