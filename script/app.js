let senate = document.getElementById("senate")
let house = document.getElementById("house")

const app = Vue.createApp({
    data(){
        return{
            members: [],
            esVisible:true,
            esVisible2: false,
            verMas: true,
            verMenos: false,
            states: [],
            selected:"",
            partys:[],
        }
    },
    created(){
        if(senate){
            var endpoint = "https://api.propublica.org/congress/v1/113/senate/members.json"
        }else if(house){
            var endpoint = "https://api.propublica.org/congress/v1/113/house/members.json"
        }
        init = {
            method: "GET",
            headers: {
                "X-API-Key": "fNVHflGcgHruZApJSimBmD0L13IOBbpC9WSjM8OH"
            }
        }
        fetch(endpoint,init)
            .then(res =>{
                if(res.ok){
                    return res.json()
                }else{
                    throw new Error("Hubo un problema")
                }
            } )
            .then(json => {this.members = json.results[0].members
                // console.log(this.members)            
            })



    },
    methods:{
        toggleVisible(){
            this.itIsVisible = !this.itIsVisible
        },

        verMasFunction(){
            this.esVisible2 = true,
            this.verMas = false,
            this.verMenos = true
        },

        verMenosFunction(){
            this.esVisible2 = false,
            this.verMenos = false,
            this.verMas = true  
        }

        

    },
    computed:{
        filterState(){
            let repeatedStates = [];
            this.members.map(e => repeatedStates.push(e.state));
            let states = [];
            repeatedStates.sort();
            for(let i = 0; i<repeatedStates.length;i++){
                if(repeatedStates[i] != repeatedStates[i+1]){
                    states.push(repeatedStates[i])
                }
            }
            return this.states = states;
        },

        filterMembers(){
            let checkeds = this.members.filter(member=> this.partys.includes(member.party) || this.partys.length === 0 )
            if(this.selected == ""){
                return checkeds
            } else{
                let selected = this.selected.split(" ")
                let selecteds = [...checkeds].filter(e=>e.state==selected & this.partys.includes(e.party) || this.partys.length === 0)
                return selecteds;
            }
            
        },

        filterParty(){
            let votesDemocrat = 0;
            let contDemocrat = 0;
            let votesIndependet = 0;
            let contIndependet = 0;
            let votesRepublican = 0;
            let contRepublican = 0;

            this.members.forEach(member =>{
                if(member.party == "D"){
                    votesDemocrat += member.votes_with_party_pct 
                    contDemocrat++
                }else if(member.party =="R"){
                    votesRepublican += member.votes_with_party_pct
                    contRepublican++
                }else if(member.party =="I" || member.party =="ID"){
                    votesIndependet += member.votes_with_party_pct
                    contIndependet ++
                }
            })
            let partys = [{
                nameParty:"Democrat",
                totalVotesParty:contDemocrat,
                totalPctPart:(votesDemocrat / contDemocrat).toFixed(2),
            },{
                nameParty:"Republican",
                totalVotesParty:contRepublican,
                totalPctPart:(votesRepublican / contRepublican).toFixed(2), 
            },{
                nameParty:"Independent",
                totalVotesParty:contIndependet,
                totalPctPart:((votesIndependet / contIndependet) ? (votesIndependet / contIndependet) : 0).toFixed(2),
            },{
                nameParty:"Total",
                totalVotesParty: contRepublican + contIndependet + contDemocrat,
                totalPctPart: ((votesDemocrat + votesIndependet + votesRepublican) / (contDemocrat+ contRepublican + contIndependet)).toFixed(2)
            },
            ]
            return partys;
        },

        mostAttendance(){
            newArray = [...this.members]
            function increasedAttendance(array){
                let countVotes = array.sort((a, b) => a.missed_votes_pct - b.missed_votes_pct)
                let positionTen = (countVotes.length * .1).toFixed(0)
                let arrayAux = []
                for(let i = 0; i< positionTen; i++){
                    arrayAux.push(countVotes[i])
                }
                return arrayAux
            }
            return increasedAttendance(newArray)
        },
       
        lessAttendance(){
            newArray = [...this.members]
            function decreaseAttendance(array){
                let countVotes = array.sort((a, b) => b.missed_votes_pct - a.missed_votes_pct)
                let positionDiez = (countVotes.length * .1).toFixed(0)
                let arrayAux = []
                for(let i = 0; i< positionDiez; i++){
                    arrayAux.push(countVotes[i])
                }
                return arrayAux
            }
            return decreaseAttendance(newArray)
        },

        moreLoyalty(){
            newArray = [...this.members]
            function increasedLoyalty(array){
                let countVotes = array.sort((a, b) => b.votes_with_party_pct - a.votes_with_party_pct)
                let positionDiez = (countVotes.length * .1).toFixed(0)
                let arrayAux = []
                for(let i = 0; i< positionDiez; i++){
                    arrayAux.push(countVotes[i])
                }
                return arrayAux
            }
            return increasedLoyalty(newArray)
        },
        
        lessLoyalty(){
            newArray = [...this.members]
            function decreaseAttendance(array){
                let countVotes = array.sort((a, b) => a.votes_with_party_pct - b.votes_with_party_pct)
                let positionDiez = (countVotes.length * .1).toFixed(0)
                let arrayAux = []
                for(let i = 0; i< positionDiez; i++){
                    arrayAux.push(countVotes[i])
                }
                return arrayAux
            }
            return decreaseAttendance(newArray)
        }
    },  
})

app.mount("#app");

var readMore = 0;

function read() {
    if (!readMore) {
      document.getElementById("more").style.display = "inline";
      document.getElementById("dots").style.display = "none";
      document.getElementById("read").innerHTML = "Read Less";
      readMore = 1;
    } else {
      document.getElementById("more").style.display = "none";
      document.getElementById("dots").style.display = "inline";
      document.getElementById("read").innerHTML = "Read More";
      readMore = 0;
    }
  }


