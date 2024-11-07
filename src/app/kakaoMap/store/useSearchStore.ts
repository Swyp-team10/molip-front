import create from 'zustand';

interface ISearchStore {
	searchKeyword: string;
	setSearchKeyword: (keyword: string) => void;
	searchResult: kakao.maps.services.PlacesSearchResultItem[] | null;
	setSearchResult: (
		results: kakao.maps.services.PlacesSearchResultItem[] | null,
	) => void;
	markers: {
		position: {
			lat: number;
			lng: number;
		};
		content: string;
	}[];
	setMarkers: (
		markers: { position: { lat: number; lng: number }; content: string }[],
	) => void;
	map: kakao.maps.Map | null;
	setMap: (newMap: kakao.maps.Map | null) => void;
}

const useSearchStore = create<ISearchStore>((set) => ({
	searchResult: null,
	setSearchResult: (
		results: kakao.maps.services.PlacesSearchResultItem[] | null,
	) => set({ searchResult: results }),
	searchKeyword: '',
	setSearchKeyword: (keyword: string) => set({ searchKeyword: keyword }),
	markers: [],
	setMarkers: (markers) => set({ markers }),
	map: null,
	setMap: (newMap) => set({ map: newMap }),
}));

export default useSearchStore;
