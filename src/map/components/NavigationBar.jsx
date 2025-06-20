import React from 'react'

function NavBarQuickFilter(props) {
    return (
        <button className="nav-bar-quick-filter">
            {props.text}
        </button>
    )
}

function NavBarFilterRow() {
    return (
        <div className="nav-bar-filter-row">
            <NavBarQuickFilter text="All"/>
            <NavBarQuickFilter text="Food Banks"/>
            <NavBarQuickFilter text="Vegan"/>
            <NavBarQuickFilter text="Halal"/>
        </div>
    )
}

function NavigationBar() {
  return (
    <div className={"navigation-bar"}>
      <input type={"text"} placeholder={"Search food item here"}/>
        <NavBarFilterRow/>
    </div>
  )
}

export default NavigationBar