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

    return <div className="page-numbers">
        <span onClick={ () => prevPage() }>-</span>
        <span>{ page + 1 }</span>
        <span onClick={ () => nextPage() }>{ next }</span>
    </div>
}