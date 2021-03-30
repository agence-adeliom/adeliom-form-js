<template>

    <div class="form-group__choices" v-if="field.type === 'radio' || field.type === 'checkbox'">
        <div class="choice" v-for="(choice, index) in field.choices">
            <input :type="field.type"
                   v-model="fields[field.name]"
                   class="control"
                   :class="[[ field.class, {required: field.required} ]]"
                   :id="field.name + '-' + index"
                   :name="field.type === 'radio' ? field.name : (field.name + '-' + index)"
                   :value="choice.value"
                   :checked="choice.value === fields[field.name]"
            />
            <label :for="[[ field.name + '-' + index ]]">
                <div></div>
                <span class="name">{{ choice.label }}</span>
            </label>
        </div>
    </div>

    <textarea  v-else-if="field.type === 'textarea'"
               :type="[[ field.type ]]"
               class="control"
               v-model="fields[field.name]"
               :class="[[ field.class, {required: field.required} ]]"
               :id="field.name"
               :name="field.name"
               :placeholder="field.placeholder">
                </textarea>

    <select v-else-if="field.type === 'select'"
            class="control"
            v-model="fields[field.name]"
            :class="[[ field.class, {required: field.required} ]]"
            :id="field.name"
            :name="field.name"
            :placeholder="field.placeholder">
    </select>

    <input  v-else
            :type="field.type"
            class="control"
            v-model="fields[field.name]"
            :class="[[ field.class, {required: field.required} ]]"
            :id="field.name"
            :name="field.name"
            :placeholder="field.placeholder" />

</template>

<script>
    export default {
        props: ["field", "fields"],
        data() {
            return {}
        }
    }
</script>
