import { Component } from '@angular/core';
//import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { AngularFireDatabase } from 'angularfire2/database';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = "";
	name = "hola mundo";

	prueba(name){
		console.log(name);
	}

	/*
	my_notes = [
		{id:1, title:"Note 1", descripcion:"Descripcion for note 1"}
		{id:2, title:"Note 2", descripcion:"Descripcion for note 2"},
		{id:3, title:"Note 3", descripcion:"Descripcion for note 3"},
		{id:4, title:"Note 4", descripcion:"Descripcion for note 4"},
		{id:5, title:"Note 5", descripcion:"Descripcion for note 5"}

	];
	*/
	//ng-notas-ab9b0
	show_form = false;
	note = {id:null,title:null, descripcion:null};
	editing = false;
	
	addNote(){
		this.syncronize();
		this.editing = false;
		this.show_form = true;
		this.note = {id:null,title:null, descripcion:null};		
	}

	viewNote(note){
		this.editing = true;
		this.note = note;
		this.show_form = true;
	}
	/*createNote(){
		// para que no me la repita o me lo sobre escriba
		if (this.editing){
			var me = this;
			this.my_notes.forEach(function(el, i){
				if(el.id === me.note.id){
					me.my_notes[i] = me.note;
				}
			});
			me.show_form = false;
		}else{
			this.note.id = Date.now();
			this.my_notes.push(this.note)
			this.show_form = true;
			this.note = {id:null,title:null, descripcion:null};		
		}
	}*/

	cancel(){
		this.show_form = false;
	}

	/*delete(){
		
		var me = this;
		this.my_notes.forEach(function(el, i){
			if(el == me.note){
				me.my_notes.splice(i, 1);
			}
		});
		this.show_form = false;
		this.note = {id:null,title:null, descripcion:null};

	}*/


	my_notes: any;
	my_no: any;
	my_notes_offline = [];

	constructor( public afDB: AngularFireDatabase) {
	    
	    if(navigator.onLine){
			this.getNotas().subscribe(notas => {
		      this.my_notes = notas;
		      localStorage.setItem('my_notes', JSON.stringify(this.my_notes));
		      console.log("navigator.onLine")
		    });	    
		}else{
			console.log("No navigator.onLine")
		 	this.my_notes = JSON.parse(localStorage.getItem('my_notes'));
		 	console.log(this.my_notes);
	  	}



	}
	getNotas(){
		return this.afDB.list('/notas').valueChanges();
	}

	createNote(){
		if (this.editing){
			if(navigator.onLine){
 				this.afDB.database.ref('notas/' + this.note.id).set(this.note);
 			}else{
 				this.my_notes.forEach((nota) => {
 					if (nota.id == this.note.id){
 						nota =  this.note;
 					}
 				}):
				this.my_notes_offline.push({
					id:this.note.id,
					note:this.note,
					action:'edit'
				}); 				

 			}

		}else{
			this.note.id = Date.now();
			if(navigator.onLine){
				this.afDB.database.ref('notas/' + this.note.id).set(this.note);
			}else{

				this.my_notes.push(this.note);
				this.my_notes_offline.push({
					id:this.note.id,
					note:this.note,
					action:'create'
				});
			}
			
		}
		this.show_form = false;
		this.note = {id:null,title:null, descripcion:null};
		localStorage.setItem('my_notes', JSON.stringify(this.my_notes));
	}
	removeNotas(){
		if(navigator.onLine){
			this.afDB.database.ref('notas/' + this.note.id).remove();
		}else{
			this.my_notes.forEach((nota, i) => {
				if (nota.id == this.note.id){
					this.my_notes.splice(i, 1);
				}
			}):	

			this.my_notes_offline.push({
				id:this.note.id,
				action:'remove'
			}); 
		}
		
		this.note = {id:null,title:null, descripcion:null};
		this.editing = false;
		localStorage.setItem('my_notes', JSON.stringify(this.my_notes));
	}	


	syncronize(){

		this.my_notes_offline.forEach((record) => {
			switch(record.action){
				case 'create':
					this.afDB.database.ref('notas/' + record.note.id).set(record.note);
					break;
				case 'edit':
					this.afDB.database.ref('notas/' + record.note.id).set(record.note);
					break;
				case 'remove':
					this.afDB.database.ref('notas/' + record.id).remove();
					break;
				default:
					console.log('No se pudo guardar en el database');

			}
			this.my_notes_offline.shift();
            console.log(this.my_notes_offline)
		});

	}


}
