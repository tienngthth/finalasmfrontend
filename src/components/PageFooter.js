import React from "react";

export default function pageFooter(props) {
    const { reset, load, setPage, page, next } = props

    const prevPage = () => {
        reset()
        if (page > 0) {
            setPage(page - 1)
            load(page - 1)
        } else {
            load(page)
        }
    }

    const nextPage = () => {
        reset()
        setPage(page + 1)
        load(page + 1)
    }

    return <div className="pageNumbers">
        <span className={"pageSelect"} onClick={ () => prevPage() }>-</span>
        <span className={"pageSelect"}>{ page + 1 }</span>
        <span className={"pageSelect"} onClick={ () => nextPage() }>{ next }</span>
    </div>
}