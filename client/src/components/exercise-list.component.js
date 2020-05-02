import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
const Exercise = props =>(
    <tr>
        <td>{props.exercise.username}</td>
        <td>{props.exercise.description}</td>
        <td>{props.exercise.duration}</td>
        <td>{props.exercise.date.substring(0,10)}</td>
        <td>
        <Link to={'/edit/'+props.exercise._id}><EditIcon style={{color:"black"}}/></Link>  <DeleteIcon onClick={() => { props.deleteExercise(props.exercise._id) }}/> 
        </td>   
    </tr>
)
export default class ExerciseList extends Component {
    constructor(props) {
        super(props);
        
        this.deleteExercise = this.deleteExercise.bind(this)
        this.onChangeSearch = this.onChangeSearch.bind(this); 
        this.state = {exercises: [], filterexercises: []};
      }
      
    componentDidMount(){
        
        axios.get('http://localhost:5000/exercises/')
            .then( response => {
                
                this.setState({
                    exercises:response.data,
                    filterexercises:response.data
                });
            })
            .catch((err)=>{
                console.log(err);
            })
    }  

    deleteExercise(id){
        axios.delete('http://localhost:5000/exercises/'+id)
            .then(response => { console.log(response.data)});
        this.setState({
            exercises:this.state.exercises.filter(el=> el._id !== id),
            filterexercises:this.state.filterexercises.filter(el=> el._id !== id)
        });    
    }
    
    onChangeSearch(e) {
        let currentList = [];
        let newList = [];
        if(e.target.value !== ""){
            currentList=this.state.exercises;
            newList = currentList.filter( item =>{
                const lc = item.username.toLowerCase();                
                const filter = e.target.value.toLowerCase();
                console.log(filter);
                return lc.includes(filter); 
            });
        }
        else{
            newList=this.state.exercises;
        }
        this.setState({filterexercises: newList})
      }

    exerciseList(){
        return this.state.filterexercises.map(currentExercise=>{
            return <Exercise exercise={currentExercise} deleteExercise={this.deleteExercise} key={currentExercise._id}/>
        })
    }
    render() {
        return (
            <div>
                <h3>Logged Exercises</h3>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" 
                    placeholder="Search"
                    onChange={this.onChangeSearch}/>
                    <div className="input-group-append">
                        <button className="btn btn-success" type="submit">Go</button>
                    </div>
                </div>
                <table className="table">
                <thead className="thead-light">
                    <tr>
                    <th>Username</th>
                    <th>Description</th>
                    <th>Duration</th>
                    <th>Date</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    { this.exerciseList() }
                </tbody>
                </table>
      </div>
        )
    }
}
