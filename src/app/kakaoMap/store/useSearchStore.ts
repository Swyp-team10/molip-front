import create from 'zustand';

interface ISearchStore {
	searchKeyword: string;
	setSearchKeyword: (keyword: string) => void;
	searchResult: kakao.maps.services.PlacesSearchResultItem[];
	setSearchResult: (
		results: kakao.maps.services.PlacesSearchResultItem[],
	) => void;
}

const useSearchStore = create<ISearchStore>((set) => ({
	searchResult: [],
	setSearchResult: (results: kakao.maps.services.PlacesSearchResultItem[]) =>
		set({ searchResult: results }),
	searchKeyword: '',
	setSearchKeyword: (keyword: string) => set({ searchKeyword: keyword }),
}));

export default useSearchStore;
