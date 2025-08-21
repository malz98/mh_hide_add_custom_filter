/** @odoo-module **/

import { SearchBarMenu } from "@web/search/search_bar_menu/search_bar_menu";
import { GroupByMenu } from "@web/search/group_by_menu/group_by_menu";
import { useService } from "@web/core/utils/hooks";
import { patch } from "@web/core/utils/patch";

// Patch para ocultar "Agregar Filtro Personalizado"
patch(SearchBarMenu.prototype, {
    setup() {
        super.setup();
        this.user = useService("user");
        this.showCustomFilter = true;  // Lo mantenemos visible por defecto y lo ocultamos si el usuario pertenece al grupo

        this.checkUserGroup();
    },

    async checkUserGroup() {
        // La lógica original era un poco inversa. La corregimos para mayor claridad.
        // hasGroup devuelve true si el usuario está en el grupo.
        // Si está en el grupo, queremos ocultar el filtro.
        const isMemberOfHideGroup = await this.user.hasGroup("mh_hide_add_custom_filter.group_hide_add_custom_filter");
        if (isMemberOfHideGroup) {
            this.showCustomFilter = false; // Ocultar si pertenece al grupo
            this.render();
        }
    },
});

// Nuevo Patch para ocultar "Agregar grupo personalizado"
patch(GroupByMenu.prototype, {
    setup() {
        super.setup();
        this.user = useService("user");
        this.showCustomGroupBy = true; // Lo mantenemos visible por defecto y lo ocultamos si el usuario pertenece al grupo

        this.checkUserGroupForGroupBy();
    },

    async checkUserGroupForGroupBy() {
        const isMemberOfHideGroup = await this.user.hasGroup("mh_hide_add_custom_filter.group_hide_add_custom_filter");
        if (isMemberOfHideGroup) {
            this.showCustomGroupBy = false; // Ocultar si pertenece al grupo
            this.render();
        }
    },
});