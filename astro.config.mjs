// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'secondtrack',
			description:
				'The complete documentation for secondtrack, a self-hosted cockpit for a refurbishing and repair business.',
			logo: {
				light: './src/assets/secondtrack_banner-black.png',
				dark: './src/assets/secondtrack_banner-white.png',
				replacesTitle: true,
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/vredix-openvuture/secondtrack',
				},
			],
			customCss: ['./src/styles/secondtrack.css'],
			editLink: {
				baseUrl: 'https://github.com/vredix-openvuture/secondtrack-wiki/edit/main/',
			},
			lastUpdated: true,
			pagination: true,
			tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
			sidebar: [
				{
					label: 'Start here',
					items: [
						{ label: 'What secondtrack is', slug: 'start/what-it-is' },
						{ label: 'Installation', slug: 'start/install' },
						{ label: 'First run', slug: 'start/first-run' },
						{ label: 'Updating and removing', slug: 'start/update-remove' },
					],
				},
				{
					label: 'How it fits together',
					items: [
						{ label: 'One home per fact', slug: 'concepts/one-home' },
						{ label: 'The item that travels', slug: 'concepts/items' },
						{ label: 'How the money is worked out', slug: 'concepts/money' },
						{ label: 'How settings are stored', slug: 'concepts/settings-model' },
					],
				},
				{
					label: 'The warehouse',
					items: [
						{ label: 'The four departments', slug: 'warehouse/departments' },
						{ label: 'Parts', slug: 'warehouse/parts' },
						{ label: 'Lots and finished goods', slug: 'warehouse/sets' },
						{ label: 'Merch', slug: 'warehouse/merch' },
						{ label: 'Categories and fields', slug: 'warehouse/categories' },
						{ label: 'Locations and suppliers', slug: 'warehouse/locations-suppliers' },
						{ label: 'Codes, labels and scanning', slug: 'warehouse/codes-labels' },
					],
				},
				{
					label: 'Projects',
					items: [
						{ label: 'What a project is', slug: 'projects/overview' },
						{ label: 'Items on a project', slug: 'projects/items' },
						{ label: 'Time and price', slug: 'projects/time-and-price' },
						{ label: 'Notes, photos and export', slug: 'projects/notes-photos' },
						{ label: 'Invoicing a project', slug: 'projects/invoicing' },
					],
				},
				{
					label: 'Money',
					items: [
						{ label: 'Expenses', slug: 'money/expenses' },
						{ label: 'The hub', slug: 'money/hub' },
						{ label: 'Email, reminders and dunning', slug: 'money/email' },
						{ label: 'Statistics', slug: 'money/statistics' },
					],
				},
				{
					label: 'Shop and tasks',
					items: [
						{ label: 'Shop orders', slug: 'shop/orders' },
						{ label: 'Tasks and boards', slug: 'shop/tasks' },
					],
				},
				{
					label: 'The interface',
					items: [
						{ label: 'The dashboard', slug: 'ui/dashboard' },
						{ label: 'Style and wallpaper', slug: 'ui/style' },
						{ label: 'Account, keys and the app', slug: 'ui/app' },
					],
				},
				{
					label: 'Connections',
					items: [
						{ label: 'InvoiceNinja', slug: 'integrations/invoiceninja' },
						{ label: 'WooCommerce', slug: 'integrations/woocommerce' },
						{ label: 'Vikunja', slug: 'integrations/vikunja' },
						{ label: 'Nextcloud', slug: 'integrations/nextcloud' },
						{ label: 'eBay', slug: 'integrations/ebay' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Environment variables', slug: 'reference/environment' },
						{ label: 'Settings keys', slug: 'reference/settings' },
						{ label: 'Routes', slug: 'reference/routes' },
						{ label: 'Data model', slug: 'reference/data-model' },
						{ label: 'Files and paths', slug: 'reference/files' },
						{ label: 'Background jobs', slug: 'reference/jobs' },
					],
				},
				{
					label: 'Help',
					items: [
						{ label: 'Troubleshooting', slug: 'help/troubleshooting' },
						{ label: 'FAQ', slug: 'help/faq' },
						{ label: 'Accessibility', slug: 'help/accessibility' },
						{ label: 'Developing secondtrack', slug: 'help/development' },
					],
				},
			],
		}),
	],
});
