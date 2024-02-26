<script>
  // core components
  import CardSettings from "components/Cards/CardSettings.svelte";
  import CardProfile from "components/Cards/CardProfile.svelte";
  import AdminNavbar from "components/Navbars/AdminNavbar.svelte";
  export let location;
</script>

<div class="flex flex-wrap">
  <AdminNavbar />
  <div class="w-full lg:w-8/12 px-4">
    <CardSettings />
  </div>
  <div class="w-full lg:w-4/12 px-4">
    <CardProfile />
  </div>
</div>
