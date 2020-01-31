import React from "react";
import _ from "lodash";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      databases: [{
              "database_name": "database1",
              "tables": [
                  {"table_name":"table1", "columns": [
                      {"column_name": "col1", "id": "1"},
                      {"column_name": "col2", "id": "2"},
                      {"column_name": "col3", "id": "3"},
                  ]},
                  {"table_name":"table2", "columns": [
                      {"column_name": "col1", "id": "4"},
                      {"column_name": "col2", "id": "5"},
                      {"column_name": "col3", "id": "6"},
                      {"column_name": "col4", "id": "7"},
                      {"column_name": "col4", "id": "8"},
                  ]},
                  {"table_name":"table3", "columns": []},
                  {"table_name":"table4", "columns": [
                      {"column_name": "col1", "id": "9"},
                      {"column_name": "col2", "id": "10"}
                  ]}
              ]
          }
      ],
      forms: [{"index": 0}] ,
      first_data:[],
      second_data:[],
      first_update_data:[],
      second_update_data:[],
      show_create_groupin_dt2:false,
      showformindt2:false,
      dt2_group_name:null,
      dt2_group_description:null,
      dt2groups:[],
      showDT2SubGroupform:false,
      dt2_sub_group_name:null,
      dt2_sub_group_description:null,
      dt2subgroupcreated:false,
      dt2_dragged_columns:[],
      dt1selectedcolumns:[],
      showcreateform:false,
      selected_column_d2:{},
      created_form: []
    };
  }

  animateFirstForm = (last_index=null) => {
    let index_id = null;
    if(last_index){
      console.log(1)
      index_id = "transion"+last_index
    } else {
      console.log(2)
      index_id = "transion0"
    }
    let transition_id = document.getElementById(index_id)
    console.log(transition_id)
    transition_id.style.transition = "1s";
    transition_id.style.height = "100px";
  }

    addForm = () => {
      if(!this.state.forms.length){
        this.setState({
          forms: [{"index": 0}]
        }, () => this.animateFirstForm())
        return 
      }

      if(this.state.forms.length > 6){
        alert("Max operation creation is 5 !")
        return 
      }

      let last_index = this.state.forms[this.state.forms.length -1]["index"]
      
      this.setState({
        forms: [...this.state.forms, {"index": last_index+1}]
      }, () => this.animateFirstForm(last_index))
    }

    onFirstChange = (e, index) => {
      let first_data = this.state.first_data
      first_data[index] = {"name": e.target.value, "index": index}
      this.setState({
        first_data: first_data
      })
    }

    onSecondChange = (e, index) => {
      this.state.second_data[index] = {"desc": e.target.value, "index": index}
      this.setState({
        second_data: this.state.second_data
      })
    }

    onFirstUpdateChange = (e, index) => {
      this.state.first_update_data[index] = {"name": e.target.value, "index": index}
      this.setState({
        first_update_data: this.state.first_update_data
      })
    }

    onSecondUpdateChange = (e, index) => {
      this.state.second_update_data[index] = {"desc": e.target.value, "index": index}
      this.setState({
        second_update_data: this.state.second_update_data
      })
    }

    removeForm = () => {
      let forms = this.state.forms;
      forms.pop()
      this.setState({
        forms: forms
      })
    }

    handleSubmit = () => {
      let forms = this.state.forms;
      if(forms.length < 2){
        alert("create a sub group to submit..")
        return 
      }
      
      let data1 = this.state.first_data
      let data2 = this.state.second_data
      let new_data1 = []
      for(let i of JSON.parse(JSON.stringify(data1))){
        new_data1.push(i)
      }
 


      for(let d1 of new_data1){
        if(!d1.name.length && d1.index === 0) {
          alert("group name id required..")
        } else if (!d1.name.length && d1.index === 1){
          alert("sub group name is required..")
        } else if(!d1.name.length && d1.index >= 2){
          alert("operation name is required..")
        }
      }

      for(let d2 of data2){
        if(!d2.desc.length && d2.index === 0) {
          alert("group desc id required..")
        } else if (!d2.desc.length && d2.index === 1){
          alert("sub group desc is required..")
        } else if(!d2.desc.length && d2.index >= 2){
          alert("operation desc is required..")
        }
      }

      for(let i=0; i< new_data1.length; i++){
        if(new_data1[i]["index"] === data2[i]["index"]){
          new_data1[i]["desc"] = data2[i]["desc"]
        }
      }

      let group_name = new_data1[0]["name"]
      let group_desc = new_data1[0]["desc"]
      let sub_group_name = new_data1[1]["name"]
      let sub_group_desc = new_data1[1]["desc"]
      let operations = []
      if(new_data1.length > 2){
        new_data1.splice(0, 2)  
        for(let i of new_data1){
          operations.push({"name": i.name, "desc": i.desc})
        }
      }


      let selected_column_d2 = this.state.selected_column_d2
      let created_group = [
          {"group_name": group_name, "group_desc": group_desc, "sub_groups": [
          {"sub_group_name": sub_group_name, "sub_group_desc": sub_group_desc, "operations": operations, 
          "columns": [selected_column_d2]
        }
      ]
    }]



    let dt2groups = this.state.dt2groups;
    let newDt2groups = dt2groups.concat(created_group);

    this.setState({
      dt2groups: newDt2groups
    }, () => this.handleCallsAfterSubmit())  
    let dt2_dragged_columns = this.state.dt2_dragged_columns;
    for(let i=0; i<dt2_dragged_columns.length; i++){
      if(selected_column_d2["id"] === dt2_dragged_columns[i]["id"]){
        dt2_dragged_columns.splice(i, 1)
      }
    } 
    this.setState({
      forms:[],
      showcreateform: false
    }, () => this.addEmptyForm())   

    }

    addEmptyForm = () => {
      this.setState({
        forms: [{"index": 0}]
      })
    }

    handleCallsAfterSubmit = () => {
      this.handleDT2Tree()
      this.handleDt2CreatedGroupsColumnsColor()
    }

    handleUpdate = () => {
          let created_form = this.state.created_form;
          let data1 =this.state.first_update_data;
          let data2 = this.state.second_update_data;
          
          let created_form_new = JSON.parse(JSON.stringify(created_form))
          let column_id = created_form_new[0]["column_id"]


          for(let i of data1){
            for(let j of created_form_new){

              try{
                if(i.index === j.index){
                  if(i.index === 0){
                    j.group_name = i.name
                  } else if(i.index === 1){
                    j.sub_group_name =  i.name
                  } else {
                    j.name =  i.name
                  }
                }
              } catch(err) {
                // console.log(i, j)
              }


            }
          }

          for(let i of data2){
            for(let j of created_form_new){

              try{
                if(i.index === j.index){
                  if(i.index === 0){
                    j.group_desc = i.desc
                  } else if(i.index === 1){
                    j.sub_group_desc =  i.desc
                    // console.log(j.sub_group_desc, "j.sub_group_desc")
                  } else {
                    j.desc =  i.desc
                  }
                }
              } catch(err) {
                // console.log(i, j)
              }


            }
          }

          let created_form_new2 = []
          for(let i of JSON.parse(JSON.stringify(created_form_new))){
            created_form_new2.push(i)
          }

    

          let group_name = created_form_new2[0]["group_name"]
          let group_desc = created_form_new2[0]["group_desc"]
          let sub_group_name = created_form_new2[1]["sub_group_name"]
          let sub_group_desc = created_form_new2[1]["sub_group_desc"]
          let operations = []
          if(created_form_new2.length > 2){
            created_form_new2.splice(0, 2)
            for(let i of created_form_new2){
              operations.push({"name": i.name, "desc": i.desc})
            }
          }

        let created_group = [
              {"group_name": group_name, "group_desc": group_desc, "sub_groups": [
              {"sub_group_name": sub_group_name, "sub_group_desc": sub_group_desc, "operations": operations, 
              "columns": []
            }
          ]
        }]

        let columns = []
        let dt2groups = this.state.dt2groups;
        let counter = 0
        for (let dt2group of dt2groups){
          for (let sub_group of dt2group.sub_groups){
            for(let column of sub_group.columns){
              if(column.id === column_id){
                columns = sub_group.columns
                dt2groups.splice(counter)
              }
            }
          }
          counter+=1
        }
        created_group[0]["sub_groups"][0]["columns"] = columns
        let newDt2groups = dt2groups.concat(created_group);
      
        this.setState({
          dt2groups: newDt2groups
        }, () => this.handleDT2Tree())  

        this.setState({
          created_form:[],
          showcreateform: false
        })   

    }
          
    allowDrop = (ev) => {
      ev.preventDefault();
    }
  
    drag = (ev) => {
      ev.dataTransfer.setData("text", ev.target.id);
    }
  
    handleDT2draggedColumnsColor = () => {
      let dt2_dragged_columns = this.state.dt2_dragged_columns;
      let databases = this.state.databases;
      let dragged_columns = []
      for(let dt2_dragged_column of dt2_dragged_columns){
        dragged_columns.push(dt2_dragged_column.id);
      }
        for(let database of databases){
          for(let table of database.tables){
            for(let column of table.columns){
              let num = column.id
              if(dragged_columns.includes(num.toString())){
                column["dragged"] = 1
              }
            }
          }
        }

        this.setState({
          databases: databases
        })
    }

    handleDT1selectedColumnsColor = () => {
      let dt1selectedcolumns = this.state.dt1selectedcolumns;
      let databases = this.state.databases;
      let selected_columns = []
      for(let dt1selectedcolumn of dt1selectedcolumns){
        selected_columns.push(dt1selectedcolumn);
      }
        for(let database of databases){
          for(let table of database.tables){
            for(let column of table.columns){
              let num = column.id
              if(selected_columns.includes(num.toString())){
                column["selected"] = true
              }
            }
          }
        }
        this.setState({
          databases: databases
        })
    }

    hanldeSelectedColumns = (id) => {
      this.setState({
        dt1selectedcolumns: id
      }, () => this.handleDT1selectedColumnsColor())
    }
    
    drop = (ev) => {
      ev.preventDefault();
      var data = ev.dataTransfer.getData("text");
      let dt2_dragged_columns = this.state.dt2_dragged_columns;

      for(let dt2_dragged_column of dt2_dragged_columns){
        if(dt2_dragged_column.id === data){
          alert("column already exist...")
          return
        }
      }

      let item = document.getElementById(data);
        this.setState(previousState => ({
          dt2_dragged_columns: [...previousState.dt2_dragged_columns, {"id": data, "column_name": item.innerHTML.split("</i> ")[1] }]
      }),  () => this.handleDT2draggedColumnsColor());
      return
    }

    handleDt2CreatedGroupsColumnsColor(){
      console.log("----------------->>>>")
      let databases = this.state.databases;
      let dt2groups = this.state.dt2groups;
      console.log(JSON.stringify(dt2groups))
      let grouped_column_ids = []
      for(let dt2group of dt2groups){
        for(let sub_group of dt2group.sub_groups){
          for(let column of sub_group.columns){
            grouped_column_ids.push(column.id)
          }
        }
      }
      grouped_column_ids = _.union(grouped_column_ids)
      for(let database of databases){
        for(let table of database.tables){
          for(let column of table.columns){
            if(grouped_column_ids.includes(column.id)){
              column["dragged"] = 2
            }
          }
        }
      }

      this.setState({
        databases: databases
      })
    }

    dropInSubGroups = (ev, group_name, sub_group_name) => {
      ev.preventDefault();
      var data = ev.dataTransfer.getData("text");      
      let item = document.getElementById(data);

      let dt2groups = this.state.dt2groups;

      for (let dt2group of dt2groups){
        if(dt2group.group_name === group_name){
          for(let sub_group of dt2group.sub_groups){
            if(sub_group.sub_group_name === sub_group_name){
              for(let column of sub_group.columns){
                if (column.id === data){
                  alert("column already exist...")
                  return
                }
              }
              sub_group.columns.push({"id": data, "column_name": item.innerHTML.split("</i> ")[1] })
            }
          }
        }
      }

    let counter = 0;
    let dt2_dragged_columns = this.state.dt2_dragged_columns
    for(let i of dt2_dragged_columns){
      if(i.id===data){
        dt2_dragged_columns.splice(counter, 1)
      }
      counter+=1
    }

      this.setState({
        dt2groups: dt2groups,
        dt2_dragged_columns: dt2_dragged_columns
      })
      this.handleDt2CreatedGroupsColumnsColor()

      return 
    }

    showFormInDT2 = (event, show) => {
      event.preventDefault()
      this.setState({
        showformindt2: show
      })
    }

    componentDidMount(){
      let toggler = document.getElementsByClassName("caret");    
      for (let i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function() {
          this.parentElement.querySelector(".nested").classList.toggle("active");
          this.classList.toggle("caret-down");
        });
      }
    }

    handleDT2Tree = () => {
      let toggler2 = document.getElementsByClassName("caret2");    
      for (let i = 0; i < toggler2.length; i++) {
        toggler2[i].addEventListener("click", function() {
          this.parentElement.querySelector(".nested2").classList.toggle("active2");
          this.classList.toggle("caret-down2");
        });
      }
    }

    handleDT2GroupSumit = () => {
      let group_name = this.state.dt2_group_name;
      let group_desc = this.state.dt2_group_description;
      this.setState(previousState => ({
        dt2groups: [...previousState.dt2groups, {"group_name": group_name, "group_desc": group_desc, sub_groups: []}]
      }));

      this.setState({
        showformindt2: false
      }, () => this.handleDT2Tree())
    }

    makeDT2SubGroup = (group_name) => {
      let showDT2SubGroupform = {"show": true, "group_name": group_name}
      this.setState({
        showDT2SubGroupform
      })
    }

    handleDT2subGroupSumit = (group_name) => {
      let groups = this.state.dt2groups;
      for(let group of groups){
        if(group_name === group.group_name){
          let sub_group = {"sub_group_name": this.state.dt2_sub_group_name, "sub_group_desc": this.state.dt2_sub_group_description, "columns": []}
          group.sub_groups.push(sub_group)
        }
      }

      this.setState({
        dt2groups: groups,
        showDT2SubGroupform:false,
        dt2subgroupcreated:true
      })
    }

    removeArrayItemColumns = (array, item) => {
      for(var i in array){
          if(array[i]["id"]===item){
              array.splice(i,1);
              break;
          }
      }
      return array
    }

    removeArrayItemSubGroup = (array, item) => {
    for(var i in array){
        if(array[i]["sub_group_name"]===item){
            array.splice(i,1);
            break;
        }
    }
    return array
    }

    removeArrayItemGroup = (array, item) => {
    for(var i in array){
        if(array[i]["group_name"]===item){
            array.splice(i,1);
            break;
        }
    }
    return array
    }


    handleColorsIndatabaseColumns = () => {
      this.handleDT2draggedColumnsColor()
      // this.handleDt2CreatedGroupsColumnsColor()
    }

    deleteColumn = (id, group_name, sub_group_name) => {
      let dt2groups = this.state.dt2groups;
      for(let dt2group of dt2groups){
        if(group_name === dt2group.group_name){
          for(let sub_group of dt2group.sub_groups){
            if(sub_group.sub_group_name === sub_group_name){
              for(let column of sub_group.columns){
                if(column.id === id){
                    this.setState(previousState => ({
                        dt2_dragged_columns: [...previousState.dt2_dragged_columns, {"id":id, "column_name": column.column_name}]
                    }));
                  let filtered_arr = this.removeArrayItemColumns(sub_group.columns, id)
                  sub_group.columns = filtered_arr
                }
              }
            }
          }
        }
      }

      this.setState({
        dt2groups:dt2groups
      }, () => this.handleColorsIndatabaseColumns())

    }

    deleteSubGroup = (group_name, sub_group_name) => {
      
      let dt2groups = this.state.dt2groups;
      for(let dt2group of dt2groups){
        if(group_name === dt2group.group_name){
          for(let sub_group of dt2group.sub_groups){
            for(let column of sub_group.columns){
              this.setState(previousState => ({
                dt2_dragged_columns: [...previousState.dt2_dragged_columns, column]
              }));
            }
          }
            let filtered_arr = this.removeArrayItemSubGroup(dt2group.sub_groups, sub_group_name)
            dt2group.sub_groups = filtered_arr
        }
      }
      this.setState({
        dt2groups:dt2groups
      }, () => this.handleColorsIndatabaseColumns())
    }

    deleteGroup = (group_name) => {
      let dt2groups = this.state.dt2groups;
        for(let dt2group of dt2groups){
          for(let sub_group of dt2group.sub_groups){
            for(let column of sub_group.columns){
              this.setState(previousState => ({
                dt2_dragged_columns: [...previousState.dt2_dragged_columns, column]
              }));
            }
          }
        }

        let filtered_arr = this.removeArrayItemGroup(dt2groups, group_name)
        dt2groups.groups = filtered_arr;
    
      this.setState({
        dt2groups:dt2groups
      }, () => this.handleColorsIndatabaseColumns())
    }

    handleDelete  =(e, element, group_name, sub_group_name) => {
      e.preventDefault();
      e.stopPropagation();
      let dt2groups = this.state.dt2groups;
      let id = e.target.id
      if(element === "column"){
        this.deleteColumn(id, group_name, sub_group_name)
      } else if (element === "group"){
        if(!dt2groups.length){
          return
        }
        e.target.parentNode.removeChild(e.target);
        this.deleteGroup(group_name)
      } else if(element === "sub_group") {
        for(let dt2group of dt2groups){
          if(dt2group.group_name === group_name){
            if(!dt2group.sub_groups.length){
              return
            }
            e.target.parentNode.removeChild(e.target);
            this.deleteSubGroup(group_name, sub_group_name)
          }
        }
      }
    }

    pushToForm = (column) => {
      this.setState({
        selected_column_d2: column 
      })
      let column_id = column.id
      let dt2_dragged_columns = this.state.dt2_dragged_columns;
      for(let dt2_dragged_column of dt2_dragged_columns){
        if(dt2_dragged_column.id === column_id){
          dt2_dragged_column["selected"] = true
        }
      }
      this.setState({
        dt2_dragged_columns: dt2_dragged_columns
      })

      this.setState({
        showcreateform:true
      })
    }

    showDataInForm = (column_id, group_name, sub_group_name) => {
      let dt2groups = this.state.dt2groups;
      let created_form = []
      for(let dt2group of dt2groups){
        if(dt2group.group_name === group_name){
          for(let sub_group of dt2group.sub_groups){
            if(sub_group.sub_group_name === sub_group_name){
              for(let column of sub_group.columns){
                if(column.id === column_id){
                  created_form = dt2group
                }
              }
            }
          }
        }
      }



      let modified_form = []
      modified_form.push({"group_name":created_form.group_name, "group_desc":created_form.group_desc  , "index":0})
      modified_form.push({"sub_group_name":created_form.sub_groups[0]["sub_group_name"], "sub_group_desc":created_form.sub_groups[0]["sub_group_desc"]  , "index":1})
      
      let columns = created_form.sub_groups[0]["columns"]
      let operations = created_form.sub_groups[0]["operations"]



      let counter = 2
      for(let i of operations){
        modified_form.push({"name": i.name, "desc": i.desc, "index": counter})
        counter+=1
      }

      modified_form[0]["column_id"] = column_id
      this.setState({
        created_form: modified_form
      })

      

    }


  render() {
    
    return (
      <div>
        <div className="w3-row-padding">
          <div className="w3-third" style={{ borderRight:'2px solid black',background:'#f9f1f2', height:'100%', position:'fixed', left:"0", top:'0',overflowY:'auto' }}>
            <ul id="myUL">
              {
              this.state.databases.map(database => (
              <li>
                  <span className="caret"><i className="fa fa-database" aria-hidden="true"></i> {database.database_name}</span>
                  <ul className="nested">
                    {
                    database.tables.map(table => (
                    <li style={{ cursor:'pointer' }} id={table.id} draggable="true" onDragStart={(event) => this.drag(event)}>
                    {
                    table.columns.length ? 
                    (
                    <span className="caret"><i className="fa fa-table" aria-hidden="true"></i> {table.table_name}</span>
                    ) : (
                    <span style={{ paddingLeft:'17px' }}><i className="fa fa-table" aria-hidden="true"></i> {table.table_name}</span>
                    )
                    }
                    <ul className="nested nested-col">
                        {
                        table.columns.map(column => (
                        <li onClick={() => this.hanldeSelectedColumns(column.id)} style={column.dragged === 1 ? { cursor:'pointer', color:'red' } : column.dragged === 2 ? { cursor:'pointer', color:'#0099ff' } : column.selected ? { cursor:'pointer', background:'#eeeaee' } : { cursor:'pointer' }} id={column.id} draggable="true" onDragStart={(event) => this.drag(event)}><i className="fa fa-file-text-o" aria-hidden="true"></i> {column.column_name}</li>
                        ))
                        }
                    </ul>
                    </li>
                    ))
                    }
                  </ul>
              </li>
              )) 
              }
            </ul>
        </div>
          <div className="w3-third" style={{ borderRight:'2px solid black', background:'#eff1f1', height:'100%',left:'33%', position:'fixed',overflowY:'auto' }} onContextMenu={(e) => this.showFormInDT2(e, true)}>
        <div className="droppable" onDrop={(event) =>
            this.drop(event)} onDragStart={(event) => this.drag(event)}  onDragOver={(event) => this.allowDrop(event)} style={{ margin:'5px' }}>
            <ul>
              {
              this.state.dt2_dragged_columns.map(dt2_dragged_column => (
              <li style={dt2_dragged_column.selected ? { background:'#F7F7FA' } : {}} onClick={() => this.pushToForm(dt2_dragged_column)} className="pointer" id={dt2_dragged_column.id} draggable="true" onDragStart={(event) => this.drag(event)}>
                <i className="fa fa-file-text-o" aria-hidden="true"></i> {dt2_dragged_column.column_name} 
              </li>
              ))
              }
            </ul>
        </div>
        {
        this.state.showformindt2 ? (
        <div style={{ border:'2px solid #072856', padding:'10px', margin:'10px', borderRadius:'10px' }}>
        <p>Create group: </p>
        <input
            className="dynamicForm__itemInput"
            onChange={(e) => this.setState({dt2_group_name: e.target.value})}
        type="text"
        placeholder="name"
        />
        <br/>
        <input
            onChange={(e) => this.setState({dt2_group_description: e.target.value})}
        className="dynamicForm__itemInput"
        type="text"
        placeholder="value"
        />
        <br/>
        <button onClick={this.handleDT2GroupSumit}>Sumit</button>
      </div>
      ): (
      ''
      )
      }
      {
      this.state.dt2groups.length ? (
      <ul id="myUL">
        {
        this.state.dt2groups.map((dt2group, index) =>(
        <li>
            <span onClick={index !== this.state.dt2groups.length-1 ? () => this.handleDT2Tree() : ''} className="caret2" style={{ cursor:'pointer' }} title={dt2group.group_desc}>
            <i className="fa fa-object-group" aria-hidden="true"></i> 
            <span onClick={() => this.makeDT2SubGroup(dt2group.group_name)} 
            onContextMenu={(ev)=>this.handleDelete(ev, "group", dt2group.group_name, "")}>
            {dt2group.group_name}
            </span>
            </span>
            <ul className="nested2">
              <li>
                  {
                  this.state.showDT2SubGroupform.show === true && this.state.showDT2SubGroupform.group_name ===  dt2group.group_name ? 
                  (
              <li> <span><i className="fa fa-users" aria-hidden="true"></i> create Subgroup for {this.state.dt2_group_name}</span>
                  <div style={{ border:'2px solid #072856', padding:'10px', margin:'10px 10px 10px 50px', borderRadius:'10px' }}>
                  <input
                    className="dynamicForm__itemInput"
                    onChange={(e) => this.setState({dt2_sub_group_name: e.target.value})}
                  type="text"
                  placeholder="name"
                  />
                  <br/>
                  <input
                    onChange={(e) => this.setState({dt2_sub_group_description: e.target.value})}
                  className="dynamicForm__itemInput"
                  type="text"
                  placeholder="value"
                  />
                  <br/>
                  <button onClick={() => this.handleDT2subGroupSumit(dt2group.group_name)}>Submit</button>
                  </div>
              </li>
              ): ('')
              }
              {
              dt2group.sub_groups.map(sub_group => (
              <li onContextMenu={(ev)=>
                  this.handleDelete(ev, "sub_group", dt2group.group_name, sub_group.sub_group_name)} style={{ height:'auto',padding:'5px' }} draggable="true" onDragStart={(event) => this.drag(event)}> 
                  <span title={sub_group.sub_group_desc}><i className="fa fa-users" aria-hidden="true"></i> {sub_group.sub_group_name}</span>
                  <div onContextMenu={(ev)=>
                    this.handleDelete(ev, "column", dt2group.group_name, sub_group.sub_group_name)} onDrop={(event) => this.dropInSubGroups(event, dt2group.group_name, sub_group.sub_group_name)}  onDragOver={(event) => this.allowDrop(event)} style={{ margin:"5px 5px 5px 20px",padding:'10px', height:'auto', border:'1px dashed blue' }}>
                    <ul>
                        {
                        sub_group.columns.map(column => (
                        <li className="pointer" onDoubleClick={() => this.showDataInForm(column.id, dt2group.group_name, sub_group.sub_group_name)} id={column.id}><i className="fa fa-file-text-o" aria-hidden="true"></i> {column.column_name}</li>
                        ))
                        }
                    </ul>
                  </div>
              </li>
              ))
              }
              </li>
            </ul>
        </li>
        ))
        }
      </ul>
      ) : (
      ''
      )
      }





      </div>
          <div className="w3-third" style={{ background:'#eff5f7', height:'100%',left:'66%', position:'fixed',  right:"0", top:'0',overflowY:'auto' }}>
                {
                    this.state.forms.map((form, index) => (
                    <div id={index} key={index} className={"form-container group-form" + index === 0 ? "group-form": index === 1 ? "sub-group-form" : index >= 2 ? "operation-form"  : ""}>
                    <span className="tc bold">{index === 0 ? "Crate group" : index === 1 ? "Crate sub group" : "Crate operations"}</span>
                    
                    <div className="form-transion" id={"transion"+index}>
                    <input
                        className="dynamicForm__itemInput"
                        type="text"
                        value={form["first"]}
                        onChange={(e) => this.onFirstChange(e, index)}
                        placeholder={index === 0 ? "enter group name" : index === 1 ? "enter sub group name" : "enter operation name"}
                    />
                    <br/>
                    <input
                        className="dynamicForm__itemInput"
                        type="text"
                        value={form["secons"]}
                        onChange={(e) => this.onSecondChange(e, index)}
                        placeholder={index === 0 ? "enter group desc" : index === 1 ? "enter sub group desc" : "enter operation desc"}
                    />
                    <br/>
                    </div>

                  </div>
                  ))
                }

                  {
                    this.state.showcreateform && (
                      <div>
                      <div className="blue-font-color f15 ma2040">
                        <i onClick={() => this.removeForm()} className="fa fa-minus-circle fl pointer" aria-hidden="true"></i>
                        <i title="create group"  onClick={(e) => this.addForm(e)} className="fa fa-plus-circle fr pointer" aria-hidden="true"></i>
                      </div>
                      <br/><br/>
                      {
                        this.state.forms.length ? (
                          <center><button onClick={this.handleSubmit}>Submit</button></center>
                        ) : ('')
                      }
                      </div>
                    )
                  }


                  {
                    this.state.created_form.map((form, index) => (
                      <div className={"form-container group-form" + index === 0 ? "group-form": index === 1 ? "sub-group-form" : index >= 2 ? "operation-form"  : ""}>
                        <span className="tc bold">{index === 0 ? "Group" : index === 1 ? "Sub group" : "Operations"}</span>
                        <input
                            className="dynamicForm__itemInput"
                            type="text"
                            defaultValue={index === 0 ? form["group_name"] : index === 1 ? form["sub_group_name"] : form["name"]}
                            onChange={(e) => this.onFirstUpdateChange(e, index)}
                            placeholder={index === 0 ? "enter group name" : index === 1 ? "enter sub group name" : "enter operation name"}
                        />
                        <br/>
                        <input
                            className="dynamicForm__itemInput"
                            type="text"
                            defaultValue={index === 0 ? form["group_desc"] : index === 1 ? form["sub_group_desc"] : form["desc"]}
                            onChange={(e) => this.onSecondUpdateChange(e, index)}
                            placeholder={index === 0 ? "enter group desc" : index === 1 ? "enter sub group desc" : "enter operation desc"}
                        />
                        <br/>
                        
                      </div>
                    ))
                  }

                      {
                        this.state.created_form.length ? (
                          <center><button onClick={this.handleUpdate}>Update</button></center>
                        ) : ('')
                      }
            
                </div>
       
    
        </div>
      </div>
    );
  }
}



export default App;
