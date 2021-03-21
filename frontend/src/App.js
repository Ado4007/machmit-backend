import logo from './logo.svg';
import './App.css';
import dogecoin from 'litecore-lib';
import React from "react";
import {Component} from "react/cjs/react.production.min";
import request from 'request-promise-native';
import Navbar from "./components/Navbar";
import Gallery from "./pages/Gallery";
import Project from "./pages/Project";

const DUST = 1000;
const FEE = 1000;

const DOGETOSHI_MULTIPLIER = 100000000;

const FETCH_BALANCE_URL = "https://api.blockcypher.com/v1/ltc/main/addrs/";
const GET_UTXOS_URL = "https://api.blockcypher.com/v1/ltc/main/addrs/";
const PUBLISH_TX_URL = "https://api.blockcypher.com/v1/ltc/main/txs/push";

const GET_PROJECTS = "https://vmi254279.contaboserver.net:5000/projects";

const statusURL = 'https://api.blockcypher.com/v1/ltc/main/addrs';

//const token = "dc438169a62e4abdac886d364a5e8a14";

class App extends Component {

    async getProjects() {
        let options = {
            method: 'GET',
            uri: GET_PROJECTS,
            json: true,
            resolveWithFullResponse: true,
            simple: false
        };
        let response = await request(options);
        if(response.statusCode===200) {

            let projects = response.body.projects;
            let addresses = [];
            let projectsId = {};
            for (let project of response.body.projects) {
                addresses.push(project['litecoin_address']);
                projectsId[project['litecoin_address']] = project;
            }

            options = {
                method: 'GET',
                uri: statusURL+"/"+addresses.join(";")+"/balance",
                json: true,
                resolveWithFullResponse: true,
                simple: false
            };

            response = await request(options);

            if(response.statusCode===200 || response.statusCode===429) {
                console.log(response.body);

                for(let addr of response.body) {
                    const proj = projectsId[addr.address];
                    if(proj!=null) proj.votes = addr.final_balance/1000
                }

                this.setState({
                    projects: projects
                });
            }
        } else {
            console.log("Err: ", response.body);
        }
    }

    async requestBalance() {
        const options = {
            method: 'GET',
            uri: FETCH_BALANCE_URL+this.walletAddress+"/balance",
            json: true,
            resolveWithFullResponse: true,
            simple: false
        };
        const response = await request(options);
        if(response.statusCode===200) {
            const bal = response.body.final_balance/(DUST+FEE);
            this.setState({
                balance: bal,
                spent: 10-bal
            });
        } else {
            console.log("Err: ", response.body);
        }
    }

    async sendTx(hexData) {
        const options = {
            method: 'POST',
            body: {
                tx: hexData
            },
            uri: PUBLISH_TX_URL,
            json: true,
            resolveWithFullResponse: true,
            simple: false
        };
        const response = await request(options);
        return response.body;
    }

    async sendDogeOut(dst, amount) {
        let utxos = [];

        const options = {
            method: 'GET',
            uri: GET_UTXOS_URL+this.walletAddress+"?unspentOnly=true&includeScript=true",
            json: true,
            resolveWithFullResponse: true,
            simple: false
        };
        const response = await request(options);
        if(response.statusCode===200) {
            let confirmed = response.body.txrefs;
            let unconfirmed = response.body.unconfirmed_txrefs;
            if(confirmed!=null) {
                for(let utxo of confirmed) {
                    utxos.push(utxo);
                }
            }
            if(unconfirmed!=null) {
                for(let utxo of unconfirmed) {
                    utxos.push(utxo);
                }
            }
        } else {
            console.log("Err: ", response.body);
        }

        console.log(utxos);
        let choosenUTXO;
        let totalValue;
        if(utxos!=null && utxos.length>0) {
            //Check balance of those UTXOs
            for(let utxo of utxos) {
                totalValue = utxo.value;
                if(totalValue>=amount+FEE) {
                    choosenUTXO = utxo;
                    break;
                }
            }
        }

        if(choosenUTXO!=null) {
            const useUtxo = {
                txId: choosenUTXO.tx_hash,
                outputIndex: choosenUTXO.tx_output_n,
                address: this.walletAddress,
                script: choosenUTXO.script,
                satoshis: totalValue
            };
            console.log(useUtxo);
            let tx = new dogecoin.Transaction().from(useUtxo);
            tx = tx.to(dst, amount);
            if(totalValue-(FEE+amount)>0) {
                tx = tx.to(this.walletAddress, totalValue-(FEE+amount));
            }
            console.log(this.privKey);
            tx = tx.sign(this.privKey);

            const txHex = tx.toString();
            console.log(txHex);
            const res = await this.sendTx(txHex);
            console.log(res);
            this.requestBalance();
            this.setState({
                successMsg: "You have successfully casted your vote!"
            });
        }
    }

    async sendDoge(dst, votes) {
        let utxos = [];

        const options = {
            method: 'GET',
            uri: GET_UTXOS_URL+this.walletAddress+"?unspentOnly=true&includeScript=true",
            json: true,
            resolveWithFullResponse: true,
            simple: false
        };
        const response = await request(options);
        if(response.statusCode===200) {
            let confirmed = response.body.txrefs;
            let unconfirmed = response.body.unconfirmed_txrefs;
            if(confirmed!=null) {
                for(let utxo of confirmed) {
                    utxos.push(utxo);
                }
            }
            if(unconfirmed!=null) {
                for(let utxo of unconfirmed) {
                    utxos.push(utxo);
                }
            }
        } else {
            console.log("Err: ", response.body);
        }

        console.log(utxos);
        let choosenUTXO;
        let totalValue;
        if(utxos!=null && utxos.length>0) {
            //Check balance of those UTXOs
            for(let utxo of utxos) {
                totalValue = utxo.value;
                if(totalValue>(DUST+FEE)*votes) {
                    choosenUTXO = utxo;
                    break;
                }
            }
        }

        if(choosenUTXO!=null) {
            const useUtxo = {
                txId: choosenUTXO.tx_hash,
                outputIndex: choosenUTXO.tx_output_n,
                address: this.walletAddress,
                script: choosenUTXO.script,
                satoshis: totalValue
            };
            console.log(useUtxo);
            let tx = new dogecoin.Transaction().from(useUtxo);
            tx = tx.to(dst, DUST*votes).to(this.walletAddress, totalValue-((DUST+FEE)*votes));
            console.log(this.privKey);
            tx = tx.sign(this.privKey);

            const txHex = tx.toString();
            console.log(txHex);
            const res = await this.sendTx(txHex);
            console.log(res);
            this.requestBalance();
            this.setState({
                successMsg: "You have successfully casted your vote!"
            });
        }
    }

    async showMore(project) {
        this.setState({
            projectOpen: project
        });
    }

    setPrivKey(privKeyWIF, noReq) {
        window.localStorage.setItem("wif", privKeyWIF);
        this.privKey = new dogecoin.PrivateKey(privKeyWIF);
        this.walletAddress = this.privKey.toAddress().toString();
        console.log("Wallet address: "+this.walletAddress);
        this.setState({
            hasPrivKey: true
        });
        if(!noReq) {
            this.requestBalance();
        }
    }

    constructor(props) {
        super(props);

        this.queryDict = {};
        window.location.search.substr(1).split("&").forEach(function(item) {
            this.queryDict[item.split("=")[0]] = item.split("=")[1]
        }.bind(this));
        if(this.queryDict['wif']!=null) {
            this.setPrivKey(this.queryDict["wif"], true);
        }
        window.history.replaceState({},"","/");

        //this.useWIF = "T5faSQXGRswKZf2EMeMWdjrpsd7pyuzweRdxFjg92QLvKA4sjVpP";
        //this.useWIF = "T8ghuLHspYvFkCu9syZNQZD7XbXXDTmM9BKXBUNarW9528R9m6ru";
        const storedWIF = window.localStorage.getItem("wif");
        //Generate wallet
        this.state = {
            balance: 0,
            spent: 0
        };
        this.state.hasPrivKey = false;
        if(storedWIF!=null) {
            this.privKey = new dogecoin.PrivateKey(storedWIF);
            this.walletAddress = this.privKey.toAddress().toString();
            console.log("Wallet address: "+this.walletAddress);
            this.state.hasPrivKey = true;
        }
        /*this.state = {
            balance: 0,
            spent: 0
        };
        this.privKey = new dogecoin.PrivateKey(this.useWIF);
        this.walletAddress = this.privKey.toAddress().toString();
        console.log("Wallet address: "+this.walletAddress);
        this.state.hasPrivKey = true;*/
    }

    componentDidMount() {
        if(this.state.hasPrivKey) {
            this.requestBalance();
        }
        this.getProjects();
    }

    render() {

        let useContent = (
            <Gallery
                projects={this.state.projects}
                givenVotes={this.state.spent}
                remainingVotes={this.state.balance}
                openProject={this.showMore.bind(this)}
                hasPrivKey={this.state.hasPrivKey}
                setPrivKey={this.setPrivKey.bind(this)}
            />
        );

        if(this.state.projectOpen!=null) {
            useContent = (
                <Project
                    name={this.state.projectOpen.name}
                    id={this.state.projectOpen.id}
                    votes={this.state.projectOpen.votes}
                    givenVotes={this.state.spent}
                    remainingVotes={this.state.balance}
                    vote={async (amount) => {
                        await this.sendDoge(this.state.projectOpen.litecoin_address, amount);
                    }}
                    hasPrivKey={this.state.hasPrivKey}
                />
            );
        }

        return (
            <div className="App">
                <Navbar/>
                {useContent}
            </div>
        );
    }
}

export default App;
