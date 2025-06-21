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

function NavBarTopRow() {
    return (
        <div className="nav-bar-top-row">
            <div className={"search-container"}>
                <img src="/search_icon.png" alt=""/>
                <input type={"text"} placeholder={"Search food item here"} className={"navbar-search"}/>
            </div>
            <btn className="filter-menu-button"/>
        </div>
    )
}

function NavigationBar() {
  return (
    <div className={"navigation-bar"}>
        <NavBarTopRow/>
        <NavBarFilterRow/>
    </div>
  )
}

export default NavigationBar