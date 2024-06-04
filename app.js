const { createApp } = Vue;


const app = {
    data() {
        return {
            navItems: [],
            cardItems: [],
            navName: '',
            sidebarName: ''
        };
    },
    mounted() {
        this.readConfig();
        this.readData();
    },
    methods: {
        async readData() {
            try {
                const navResponse = await fetch('data/nav.yaml');
                const navText = await navResponse.text();
                console.log(""+navText);
                const navData = await jsyaml.load(navText);
                console.log(""+navData);

                for (let navItem of navData) {
                    navItem.sidebar.map(async sidebarItem => {
                        const cardResponse = await fetch(`data/${navItem.code}/${sidebarItem.code}.yaml`);
                        const cardText = await cardResponse.text();
                        const cardData = await jsyaml.load(cardText);
                        sidebarItem.card = cardData;
                    });
                }

                this.navItems = navData;
            } catch (error) {
                console.error('读取YAML数据错误:', error);
            }
        },
        setCardItem(sidebarItem) {
            this.sidebarName = sidebarItem.name;
            this.cardItems = sidebarItem.card;
        },
        setNavName(navItem) {
            this.navName = navItem.nav;
        },
        async readConfig() {
            const configResponse = await fetch('data/config.yaml');
            const configText = await configResponse.text();
            const configData = await jsyaml.load(configText);
            this.name = configData.name;
            this.description = configData.description;
        },
        jumpUrl(url, isBlank) {
            if (url) {
                if (!url.startsWith('http')) {
                    url = 'https://' + url;
                }
                if (isBlank) {
                    window.open(url, '_blank');
                } else {
                    window.location.href = url;
                }
            }
        }
    }
};

createApp(app).use(ElementPlus).mount('#app');

