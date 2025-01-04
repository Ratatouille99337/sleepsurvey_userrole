interface DataType {
	id: number;
	title: string;
	link: string;
	has_dropdown?: boolean;
	sub_menus?: {
		link: string;
		title: string;
	}[];
}
// menu data
const menu_data: DataType[] = [
	{
		id: 1,
		title: "Home",
		link: "#",
		has_dropdown: false
	}, 
	{
		id: 2,
		title: "Aim",
		link: "#aim",
		has_dropdown: false
	},
	{
		id: 3,
		title: "NapLytics",
		link: "#statistics",
		has_dropdown: false
	},
	{
		id: 4,
		title: "Approach",
		link: "#approach",
		has_dropdown: false
	},
	{
		id: 5,
		title: "Footer",
		link: "#footer",
		has_dropdown: false,
	},
];
export default menu_data;
