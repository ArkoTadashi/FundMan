<script>
  // core components
  import CardSettings from "components/Cards/CardSettings.svelte";
  import CardProfile from "components/Cards/CardProfile.svelte";
  import AdminNavbar from "components/Navbars/AdminNavbar.svelte";
  export let location;
</script>

<div class="flex flex-wrap justify-center">
  <AdminNavbar />
  <div class="w-full lg:w-8/12 px-4">
    <CardSettings />
  </div>
</div>
