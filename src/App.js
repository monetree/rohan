import React from "react";

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
      dt1selectedcolumns:[]
    };
  }





    addForm = () => {
      let last_index = this.state.forms[this.state.forms.length -1]["index"]
      this.setState({
        forms: [...this.state.forms, {"index": last_index+1}]
      })
    }


    onFirstChange = (e, index) => {
      this.state.first_data[index] = {"first": e.target.value, "index": index}
      this.setState({
        first_data: this.state.first_data
      })
    }

    onSecondChange = (e, index) => {
      this.state.second_data[index] = {"second": e.target.value, "index": index}
      this.setState({
        second_data: this.state.second_data
      })
    }

    removeForm = (index) => {
      let first_data = this.state.first_data;
      let second_data = this.state.second_data; 

      let first_res =  []
      let second_res = []
      for(let i of first_data) {
        if(i.index !== index){
          first_res.push(i)
        }
      }

      for(let i of second_data) {
        if(i.index !== index){
          second_res.push(i)
        }
      }

      this.setState({
        first_data:first_res,
        second_data:second_res
      })

      document.getElementById(index).remove()
      
    }

    handleSubmit = () => {
      let data1 = this.state.first_data
      let data2 = this.state.second_data

      console.log(data1, " -- " , data2)
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
                column["dragged"] = true
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
        }, console.log(this.state.databases))
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

      var cln = item.cloneNode(true);
      ev.target.appendChild(cln);


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

      this.setState({
        dt2groups: dt2groups
      })
      return 
      var cln = item.cloneNode(true);
      ev.target.appendChild(cln);
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
          if(array[i]["id"]==item){
              array.splice(i,1);
              break;
          }
      }
      return array
  }

  removeArrayItemSubGroup = (array, item) => {
    for(var i in array){
        if(array[i]["sub_group_name"]==item){
            array.splice(i,1);
            break;
        }
    }
    return array
}

  removeArrayItemGroup = (array, item) => {
    for(var i in array){
        if(array[i]["group_name"]==item){
            array.splice(i,1);
            break;
        }
    }
    return array
  }


    deleteColumn = (id, group_name, sub_group_name) => {
      let dt2groups = this.state.dt2groups;
      for(let dt2group of dt2groups){
        if(group_name === dt2group.group_name){
          for(let sub_group of dt2group.sub_groups){
            if(sub_group.sub_group_name === sub_group_name){
              for(let column of sub_group.columns){
                if(column.id === id){
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
      })
    }

    deleteSubGroup = (group_name, sub_group_name) => {
      let dt2groups = this.state.dt2groups;
      for(let dt2group of dt2groups){
        if(group_name === dt2group.group_name){
            let filtered_arr = this.removeArrayItemSubGroup(dt2group.sub_groups, sub_group_name)
            dt2group.sub_groups = filtered_arr
        }
      }
      this.setState({
        dt2groups:dt2groups
      })
    }

  

    deleteGroup = (group_name) => {
      let dt2groups = this.state.dt2groups;
        let filtered_arr = this.removeArrayItemGroup(dt2groups, group_name)
        dt2groups.groups = filtered_arr;
    
      this.setState({
        dt2groups:dt2groups
      }, console.log(this.state.dt2groups, "===>  "))
    }



    handleDelete  =(e, element, group_name, sub_group_name) => {
      e.preventDefault();
      e.stopPropagation();
      let dt2groups = this.state.dt2groups;
      let id = e.target.id
      if(element === "column"){
        e.target.parentNode.removeChild(e.target);
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



  render() {
    return (

<div> 
<div className="w3-row-padding">
  <div className="w3-third" style={{ borderRight:'2px solid black',background:'#f9f1f2', height:'100%', position:'fixed', left:"0", top:'0',overflowY:'auto' }}>


  <ul id="myUL">
    {
      this.state.databases.map(database => (
        <li><span className="caret"><i className="fa fa-database" aria-hidden="true"></i> {database.database_name}</span>
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
                          <li onClick={() => this.hanldeSelectedColumns(column.id)} style={column.dragged ? { cursor:'pointer', color:'red' } : column.selected ? { cursor:'pointer', background:'#eeeaee' } : { cursor:'pointer' }} id={column.id} draggable="true" onDragStart={(event) => this.drag(event)}><i className="fa fa-file-text-o" aria-hidden="true"></i> {column.column_name}</li>
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
    <div className="droppable" onDrop={(event) => this.drop(event)} onDragStart={(event) => this.drag(event)}  onDragOver={(event) => this.allowDrop(event)} style={{ margin:'5px' }}>
      <ul>
        {
          this.state.dt2_dragged_columns.map(dt2_dragged_column => (
            <li id={dt2_dragged_column.id} draggable="true" onDragStart={(event) => this.drag(event)}><i className="fa fa-file-text-o" aria-hidden="true"></i> {dt2_dragged_column.column_name}</li>
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
              this.state.dt2groups.map(dt2group =>(
                <li><span className="caret2" style={{ cursor:'pointer' }} title={dt2group.group_desc}>
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
                      <li onContextMenu={(ev)=>this.handleDelete(ev, "sub_group", dt2group.group_name, sub_group.sub_group_name)} style={{ height:'auto',padding:'5px' }} draggable="true" onDragStart={(event) => this.drag(event)}> 
                        <span title={sub_group.sub_group_desc}><i className="fa fa-users" aria-hidden="true"></i> {sub_group.sub_group_name}</span>
                        <div onContextMenu={(ev)=>this.handleDelete(ev, "column", dt2group.group_name, sub_group.sub_group_name)} onDrop={(event) => this.dropInSubGroups(event, dt2group.group_name, sub_group.sub_group_name)}  onDragOver={(event) => this.allowDrop(event)} style={{ margin:"5px 5px 5px 20px",padding:'10px', height:'auto' }}>
                          <ul>
                            {
                              sub_group.columns.map(column => (
                                <li id={column.id}><i className="fa fa-file-text-o" aria-hidden="true"></i> {column.column_name}</li>
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
  <div>
        
          {
            this.state.forms.map((form, index) => (
                    <div id={index} key={index} style={{ border:'2px solid #072856', padding:'10px', margin:'10px', borderRadius:'10px' }}>
                      <input
                        className="dynamicForm__itemInput"
                        type="text"
                        value={form["first"]}
                        onChange={(e) => this.onFirstChange(e, index)}
                        placeholder="name"
                      />
                      <br/>
                      <input
                        className="dynamicForm__itemInput"
                        type="text"
                        value={form["secons"]}
                        onChange={(e) => this.onSecondChange(e, index)}
                        placeholder="value"
                      />
                      <br/>
                      <button onClick={() => this.removeForm(index)}>remove form</button>
                    </div>
                ))
          }

        <button type="button" onClick={(e) => this.addForm(e)}>Add</button>

        <br/><br/>
        <button onClick={this.handleSubmit}>Submit</button>
      </div>

  </div>
</div>
</div>
    );
  }
}



export default App;
