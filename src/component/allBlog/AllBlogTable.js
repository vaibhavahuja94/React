import React, { Component } from 'react';
import BlogNavBar from '../BlogNavBar';
import { connect } from 'react-redux';
import {fetchBlog} from '../../redux/actions/GetAllBlogActions'
import DataTable from 'react-data-table-component';

class AllBlogTable extends Component {
    
    componentDidMount(){
        this.props.fetchBlog()
    }


    render() {
      const data = this.props.allblog;
const columns = [
  {
    name: '#',
    sortable: true,
    selector:'id',
    cell: row => <div data-tag="allowRowEvents"><div>{row.id}</div></div>,
  },
  {
    name: 'Blog-Image',
    cell: data => <div data-tag="allowRowEvents"><div><img alt="example" width="100px" height="100px" style={{borderRadius:"550px"}}
    className="rounded-circle" src={data.blogImgSrc} /></div></div>,
  },
  {
    name: 'Blog-Title',
    sortable: true,
    selector:'blogTitle'
    
  },
  {
    name: 'Blog-Content',
    cell: data => <div data-tag="allowRowEvents"><div>{data.desc}</div></div>,
  },
  {
    name: 'Created_By',
    cell: data => <div data-tag="allowRowEvents"><div>{data.created_by}</div></div>,
  },
  {
    name: 'Date',
    sortable: true,
    selector:'date',
    cell: data => <div data-tag="allowRowEvents"><div>{data.date}</div></div>,
  },
];
const customStyles = {
  rows: {
    style: {
      minHeight: '72px', // override the row height
    }
  },
  headCells: {
    style: {
      paddingLeft: '8px', // override the cell padding for head cells
      paddingRight: '8px',
    },
  },
  cells: {
    style: {
      paddingLeft: '8px', // override the cell padding for data cells
      paddingRight: '8px',
    },
  },
};

return (
  <>
    <BlogNavBar />
    <div id="blogbody">
      <div className="container">
        <h2>ALL BLOGS</h2>
          <DataTable
          pagination = {true}
          columns={columns}
          data={data}
          customStyles={customStyles}
          responsive={true}
          striped={true}
          highlightOnHover={true}
          />
      </div>
    </div>
  </>
  );
  }
}

const mapStateToProps = (state) => {
    return {
    allblog: state.getAllBlog.allBlog
    }
  }

const mapDispatchToProps = dispatch => {
  return{
    fetchBlog:()=>dispatch(fetchBlog())
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(AllBlogTable);
