import React, {Component, PureComponent} from 'react'
import {findDOMNode} from 'react-dom'
import PropTypes from 'prop-types'
import CSSTransition from 'react-addons-css-transition-group'
import {connect} from 'react-redux'
import CommentList from '../CommentList'
import Loader from '../common/Loader'
import {deleteArticle, loadArticle} from '../../AC'
import './style.css'

class Article extends PureComponent {
    static propTypes = {
        article: PropTypes.shape({
            title: PropTypes.string.isRequired,
            text: PropTypes.string,
            comments: PropTypes.array
        }).isRequired,
        isOpen: PropTypes.bool,
        toggleOpen: PropTypes.func
    }

    constructor(props) {
        super(props)

        this.state = {
            foo: 'bar',
            count: 0
        }
    }

    componentWillReceiveProps({ isOpen, article, loadArticle }) {
        if (!this.props.isOpen && isOpen) loadArticle(article.id)
    }

    render() {
        const {article, isOpen, toggleOpen} = this.props
        return (
            <div>
                <h2 ref = {this.setTitleRef} onClick = {this.increment}>
                    {article.title}
                    <button onClick={toggleOpen}>
                        {isOpen ? 'close' : 'open'}
                    </button>
                    <button onClick = {this.handleDelete}>
                        delete
                    </button>
                </h2>
                <CSSTransition
                    transitionAppear
                    component = "div"
                    transitionName = "article"
                    transitionEnterTimeout = {500}
                    transitionLeaveTimeout = {300}
                    transitionAppearTimeout = {1000}
                >
                    {this.getBody()}
                </CSSTransition>
                <h3>creation date: {(new Date(article.date)).toDateString()}</h3>
            </div>
        )
    }

    getBody() {
        const { isOpen, article } = this.props
        if (!isOpen) return null
        if (article.loading) return <Loader/>

        return (
            <div>
                <section>{article.text}</section>
                <CommentList article = {article} ref = {this.setCommentsRef} key = {this.state.count}/>
            </div>
        )

    }

    handleDelete = () => {
        const {deleteArticle,article} = this.props
        deleteArticle(article.id)
    }

    increment = () => this.setState({
        count: this.state.count + 1
    })

    setTitleRef = (titleRef) => {
        this.titleRef = titleRef
    }

    setCommentsRef = commentsRef => {
/*
        setInterval(() => {
            commentsRef.setState({ isOpen: !commentsRef.state.isOpen })
        }, 500)
*/
    }

}


export default connect(null, { deleteArticle, loadArticle })(Article)