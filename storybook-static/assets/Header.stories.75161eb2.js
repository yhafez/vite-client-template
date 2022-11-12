var a=Object.defineProperty;var o=(e,r)=>a(e,"name",{value:r,configurable:!0});import{H as t}from"./Header.24e6e9c3.js";import{j as s}from"./jsx-runtime.adda36d4.js";import"./Button.a7fc7e98.js";import"./iframe.734f45ba.js";const u={title:"Example/Header",component:t,parameters:{storySource:{source:`import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Header } from './Header'

export default {
	title: 'Example/Header',
	component: Header,
	parameters: {
		// More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
		layout: 'fullscreen',
	},
} as ComponentMeta<typeof Header>

const Template: ComponentStory<typeof Header> = args => <Header {...args} />

export const LoggedIn = Template.bind({})
LoggedIn.args = {
	user: {
		name: 'Jane Doe',
	},
}

export const LoggedOut = Template.bind({})
LoggedOut.args = {}
`,locationsMap:{"logged-in":{startLoc:{col:48,line:15},endLoc:{col:76,line:15},startBody:{col:48,line:15},endBody:{col:76,line:15}},"logged-out":{startLoc:{col:48,line:15},endLoc:{col:76,line:15},startBody:{col:48,line:15},endBody:{col:76,line:15}}}},layout:"fullscreen"}},n=o(e=>s(t,{...e}),"Template"),d=n.bind({});d.args={user:{name:"Jane Doe"}};const l=n.bind({});l.args={};const y=["LoggedIn","LoggedOut"];export{d as LoggedIn,l as LoggedOut,y as __namedExportsOrder,u as default};
//# sourceMappingURL=Header.stories.75161eb2.js.map
