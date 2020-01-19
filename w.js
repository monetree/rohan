
{
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
                {"table_name":"table3"},
                {"table_name":"table4", "columns": [
                    {"column_name": "col1", "id": "9"},
                    {"column_name": "col2", "id": "10"}
                ]}
            ]
        }
    ]
}




        OuterOne = ( ) => {
            alert("outer calling")
        }

        InnerOne = (ev) => {
            ev.stopPropagation()
            alert("here")
            console.log(ev.target)
        }



        <div onRightClick={()=>this.OuterOne()}>
            Outer
            <br/>
            <div onRightClick={(ev)=>this.InnerOne(ev)} style={{ margin:"10px" }}>
                INner
            </div>
        </div>



Here is my react Code.


Here i have two functions. 

One is Inner and another is Outer . When  i am calling INner it  calling the outer function because Inner div 
is wrapped inside outer div.

I wants to call only inner when i am clicking inner outer function when clicking outer div.

The same i tested with javascript it is working, but not working with react.js

Is there any way to achive this ? 

Please have a  look.