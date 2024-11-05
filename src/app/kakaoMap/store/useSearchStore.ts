import create from 'zustand';

interface ISearchStore {
	searchKeyword: string;
	setSearchKeyword: (keyword: string) => void;
	searchResult: kakao.maps.services.PlacesSearchResultItem[] | null;
	setSearchResult: (
		results: kakao.maps.services.PlacesSearchResultItem[] | null,
	) => void;
}

const useSearchStore = create<ISearchStore>((set) => ({
	searchResult: null,
	setSearchResult: (
		results: kakao.maps.services.PlacesSearchResultItem[] | null,
	) => set({ searchResult: results }),
	searchKeyword: '',
	setSearchKeyword: (keyword: string) => set({ searchKeyword: keyword }),
}));

export default useSearchStore;
