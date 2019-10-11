import React, { PureComponent } from 'react';
import { Card } from 'antd';
import CurdTable from './components/CurdTable/index';
import CurdList from './components/CurdList/index';
import QueryPanel from './components/QueryPanel/index';
import { injectChildren } from './utils';
import DataContext from './DataContext';
import { searchFieldName } from './config';

export interface CurdProps {
	modelName: string;
	data: { list: any[]; pagination?: any };
	dispatch: Function;
	onRef?: (__curd__: Curd) => void;
	children?: any;
}

export interface CurdState {
	/** sharing query panel search form */
	searchForm: any;
	/** sharing table's pagination, filter and sorter params */
	searchParams: any;
}

class Curd extends PureComponent<CurdProps, CurdState> {
	static defaultProps = {
		modelName: '',
		dispatch: () => { }
	};

	static QueryPanel = QueryPanel;
	static CurdTable = CurdTable;
	static CurdList = CurdList;

	state = {
		searchForm: {} as any,
		searchParams: {} as any
	};

	componentDidUpdate() {
		if (process.env.NODE_ENV === 'development') {
			const { searchForm, searchParams } = this.state;
			console.log("latest curd's state:");
			console.log('searchForm', searchForm);
			console.log('searchParams', searchParams);
		}
	}

	doSearch = () => {
		const { modelName, dispatch } = this.props;
		const { searchForm, searchParams } = this.state;
		dispatch({
			type: `${modelName}/fetch`,
			payload: { ...searchForm, ...searchParams }
		});
	}

	handleSearch = (type?: 'create' | 'update' | 'delete') => {
		const { data: { list } } = this.props;
		const { searchParams } = this.state;
		const currentPage = searchParams[searchFieldName.page];
		if (type === 'delete' && list.length === 1 && currentPage > 1) {
			this.setState(
				{
					searchParams: {
						...searchParams,
						[searchFieldName.page]: searchParams[searchFieldName.page] - 1,
					}
				},
				() => this.doSearch(),
			);
		} else {
			this.doSearch();
		}
	};

	renderChildren = () => {
		const { children } = this.props;
		return injectChildren(children, { __curd__: this });
	};

	handleRef = () => {
		const { onRef } = this.props;
		if (onRef) {
			onRef(this);
		}
	};

	render() {
		const { modelName, data } = this.props;
		this.handleRef();
		return (
			<DataContext.Provider value={{ modelName, data }}>
				<Card bordered={false}>{this.renderChildren()}</Card>
			</DataContext.Provider>
		);
	}
}

export default Curd;
